import jwt
import datetime
from flask import Flask, request, jsonify, make_response
from functools import wraps
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import secrets
from flask_migrate import Migrate

secret_key = secrets.token_urlsafe(50)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://myprojuser:admin@localhost/myprojdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)
app.config['SECRET_KEY'] = secret_key
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)


    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    

    organizations = db.relationship('Organization', backref='owner', lazy='dynamic')

class Organization(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(250), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    evaluator = db.Column(db.Text)
    place_name = db.Column(db.String(120))
    address = db.Column(db.String(120))
    field_of_work = db.Column(db.String(120))
    summary = db.Column(db.Text)
    date = db.Column(db.Date)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    organization_id = db.Column(db.Integer, db.ForeignKey('organization.id'), nullable=False)

    workplace_risks = db.relationship('WorkplaceRisk', backref='document', lazy=True)

class WorkplaceRisk(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    existing_controls = db.Column(db.String(250))

    document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=False)

    additional_controls = db.relationship('AdditionalControl', backref='workplace_risk', lazy=True)

class AdditionalControl(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    responsible_person = db.Column(db.String(120))
    completion_date = db.Column(db.Date)

    risk_id = db.Column(db.Integer, db.ForeignKey('workplace_risk.id'), nullable=False)

class RiskEvaluationBase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type_of_the_workplace = db.Column(db.String(120))
    risk = db.Column(db.String(120))
    risk_coefficient = db.Column(db.Float)
    control_mechanism = db.Column(db.Text)
    type = db.Column(db.String(120))
    control_mechanism_score = db.Column(db.Integer)
    reduces_potential_harm = db.Column(db.Boolean)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            print("No token found")
            return jsonify({'message': 'Token is missing!'}), 403

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            print("Token decoded", data)
            current_user = User.query.filter_by(id=data['user_id']).first()
        except Exception as e:
            print("Token is invalid", e)
            return jsonify({'message': 'Token is invalid!'}), 403

        return f(current_user, *args, **kwargs)

    return decorated






@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    user = User(
        name=data['name'],
        last_name=data['lastName'],
        email=data['email'],
        phone_number=data['phoneNumber']
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'Registration successful'}), 201

@app.route('/login', methods=['POST'])
def login():
    print( secret_key)
    auth = request.get_json()

    if not auth or not auth.get('email') or not auth.get('password'):
        return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})

    user = User.query.filter_by(email=auth.get('email')).first()

    if not user:
        return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})

    if user.check_password(auth.get('password')):
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)  # Token expires after 30 minutes
        }, app.config['SECRET_KEY'])

        return jsonify({'token': token})

    return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

@app.route('/profile', methods=['GET'])
@token_required
def get_user_profile(current_user):
    # Assuming `current_user` is the user instance obtained from the decoded JWT
    user_data = {'name': current_user.name, 'last_name': current_user.last_name}
    return jsonify(user_data), 200

@app.route('/api/token/validate', methods=['POST'])
def validate_token():
    token = request.json.get('token')
    if not token:
        return jsonify({'valid': False}), 400
    
    try:
        decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        # Optionally add additional validation logic here
        return jsonify({'valid': True}), 200
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return jsonify({'valid': False}), 401
    
@app.route('/change-password', methods=['POST'])
@token_required
def change_password(current_user):
    data = request.get_json()
    old_password = data.get('old_password')
    new_password = data.get('new_password')

    if not old_password or not new_password:
        return jsonify({'message': 'Missing password details'}), 400

    if not current_user.check_password(old_password):
        return jsonify({'message': 'Old password is incorrect'}), 401

    current_user.set_password(new_password)
    db.session.commit()
    return jsonify({'message': 'Password updated successfully'}), 200

@app.route('/change-phone-number', methods=['POST'])
@token_required
def change_phone_number(current_user):
    new_phone_number = request.json.get('new_phone_number')

    if not new_phone_number:
        return jsonify({'message': 'Missing new phone number'}), 400

    # Optional: Add validation for the phone number format here
    # if not valid_phone_number(new_phone_number):
    #     return jsonify({'message': 'Invalid phone number format'}), 400

    current_user.phone_number = new_phone_number
    db.session.commit()
    return jsonify({'message': 'Phone number updated successfully'}), 200



# Endpoint to create a new organization
@app.route('/organizations', methods=['POST'])
@token_required
def add_organization(current_user):
    data = request.get_json()
    if not data or not data.get('name'):
        return jsonify({'message': 'Missing name'}), 400

    new_org = Organization(name=data['name'], description=data['description'], user_id=current_user.id)
    db.session.add(new_org)
    db.session.commit()
    return jsonify({'message': 'Organization added', 'id': new_org.id}), 201

# Endpoint to fetch user-specific organizations
@app.route('/organizations', methods=['GET'])
@token_required
def get_organizations(current_user):
    organizations = current_user.organizations.all()
    return jsonify([{'id': org.id, 'name': org.name, 'description': org.description} for org in organizations])

# Endpoint to update an organization
@app.route('/organizations/<int:org_id>', methods=['PUT'])
@token_required
def update_organization(current_user, org_id):
    data = request.get_json()
    org = Organization.query.filter_by(id=org_id, user_id=current_user.id).first()
    if not org:
        return jsonify({'message': 'Organization not found'}), 404
    org.name = data.get('name', org.name)
    org.description = data.get('description', org.description)
    db.session.commit()
    return jsonify({'message': 'Organization updated', 'id': org.id})

# Endpoint to delete an organization
@app.route('/organizations/<int:org_id>', methods=['DELETE'])
@token_required
def delete_organization(current_user, org_id):
    org = Organization.query.filter_by(id=org_id, user_id=current_user.id).first()
    if not org:
        return jsonify({'message': 'Organization not found'}), 404
    db.session.delete(org)
    db.session.commit()
    return jsonify({'message': 'Organization deleted'})

from flask import jsonify, request

@app.route('/api/risks', methods=['GET'])
def get_risks():
    type_of_workplace = request.args.get('type_of_workplace')
    if not type_of_workplace:
        return jsonify({'error': 'Type of workplace is required'}), 400
    
    risks = RiskEvaluationBase.query.filter_by(type_of_the_workplace=type_of_workplace).all()
    if not risks:
        return jsonify({'message': 'No risks found for the specified workplace type'}), 404

    risks_dict = {}
    for risk in risks:
        if risk.risk not in risks_dict:
            risks_dict[risk.risk] = []
        risks_dict[risk.risk].append([
            risk.risk_coefficient,
            risk.control_mechanism,
            risk.type,
            risk.control_mechanism_score,
            risk.reduces_potential_harm
        ])

    return jsonify(risks_dict), 200


@app.route('/organizations/<int:org_id>/documents', methods=['GET'])
@token_required
def get_documents(current_user, org_id):
    organization = Organization.query.filter_by(id=org_id, user_id=current_user.id).first()
    if not organization:
        return jsonify({'message': 'Organization not found'}), 404
    documents = Document.query.filter_by(organization_id=org_id).all()
    return jsonify([{'id': doc.id, 'name': doc.name, 'date': doc.date} for doc in documents]), 200

@app.route('/organizations/<int:org_id>/documents', methods=['POST'])
@token_required
def add_document(current_user, org_id):
    data = request.get_json()
    new_document = Document(
        name=data['name'],
        evaluator=data['evaluator'],
        place_name=data['place_name'],
        address=data['address'],
        field_of_work=data['field_of_work'],
        summary=data['summary'],
        date=datetime.datetime.strptime(data['date'], '%Y-%m-%d'),
        organization_id=org_id,
        user_id=current_user.id
    )
    db.session.add(new_document)
    db.session.commit()
    return jsonify({'message': 'Document added', 'id': new_document.id}), 201

@app.route('/documents/<int:doc_id>', methods=['DELETE'])
@token_required
def delete_document(current_user, doc_id):
    document = Document.query.filter_by(id=doc_id, user_id=current_user.id).first()
    if not document:
        return jsonify({'message': 'Document not found'}), 404
    db.session.delete(document)
    db.session.commit()
    return jsonify({'message': 'Document deleted'})

@app.route('/documents/<int:doc_id>', methods=['PUT'])
@token_required
def update_document(current_user, doc_id):
    document = Document.query.filter_by(id=doc_id, user_id=current_user.id).first()
    if not document:
        return jsonify({'message': 'Document not found'}), 404
    data = request.get_json()
    document.name = data.get('name', document.name)
    document.evaluator = data.get('evaluator', document.evaluator)
    document.place_name = data.get('place_name', document.place_name)
    document.address = data.get('address', document.address)
    document.field_of_work = data.get('field_of_work', document.field_of_work)
    document.summary = data.get('summary', document.summary)
    document.date = datetime.strptime(data['date'], '%Y-%m-%d') if 'date' in data else document.date
    db.session.commit()
    return jsonify({'message': 'Document updated'})

@app.route('/documents/<int:doc_id>/risks', methods=['GET'])
@token_required
def get_workplace_risks(current_user, doc_id):
    document = Document.query.filter_by(id=doc_id, user_id=current_user.id).first()
    if not document:
        return jsonify({'message': 'Document not found'}), 404
    risks = WorkplaceRisk.query.filter_by(document_id=doc_id).all()
    return jsonify([{'id': risk.id, 'existing_controls': risk.existing_controls} for risk in risks]), 200

@app.route('/api/risks/by-field', methods=['GET'])
def get_risks_by_field():
    field_of_work = request.args.get('field_of_work')
    if not field_of_work:
        return jsonify({'error': 'Field of work is required'}), 400

    risks = RiskEvaluationBase.query.filter_by(type_of_the_workplace=field_of_work).all()
    if not risks:
        return jsonify({'message': 'No risks found for the specified workplace type'}), 404

    risks_data = [{
        'id': risk.id,
        'risk': risk.risk,
        'risk_coefficient': risk.risk_coefficient,
        'control_mechanism': risk.control_mechanism,
        'type': risk.type,
        'control_mechanism_score': risk.control_mechanism_score,
        'reduces_potential_harm': risk.reduces_potential_harm
    } for risk in risks]

    return jsonify(risks_data), 200


@app.route('/documents/<int:doc_id>/risks', methods=['POST'])
@token_required
def add_workplace_risk(current_user, doc_id):
    document = Document.query.filter_by(id=doc_id, user_id=current_user.id).first()
    if not document:
        return jsonify({'message': 'Document not found'}), 404
    data = request.get_json()
    new_risk = WorkplaceRisk(
        existing_controls=data['existing_controls'],
        document_id=doc_id
    )
    db.session.add(new_risk)
    db.session.commit()
    return jsonify({'message': 'Workplace risk added', 'id': new_risk.id}), 201

@app.route('/risks/<int:risk_id>', methods=['DELETE'])
@token_required
def delete_workplace_risk(current_user, risk_id):
    risk = WorkplaceRisk.query.filter_by(id=risk_id).join(Document).filter(Document.user_id == current_user.id).first()
    if not risk:
        return jsonify({'message': 'Workplace risk not found'}), 404
    db.session.delete(risk)
    db.session.commit()
    return jsonify({'message': 'Workplace risk deleted'})

@app.route('/risks/<int:risk_id>', methods=['PUT'])
@token_required
def update_workplace_risk(current_user, risk_id):
    risk = WorkplaceRisk.query.filter_by(id=risk_id).join(Document).filter(Document.user_id == current_user.id).first()
    if not risk:
        return jsonify({'message': 'Workplace risk not found'}), 404
    data = request.get_json()
    risk.existing_controls = data.get('existing_controls', risk.existing_controls)
    db.session.commit()
    return jsonify({'message': 'Workplace risk updated'})

@app.route('/risks/<int:risk_id>/controls', methods=['GET'])
@token_required
def get_additional_controls(current_user, risk_id):
    risk = WorkplaceRisk.query.filter_by(id=risk_id).join(Document).filter(Document.user_id == current_user.id).first()
    if not risk:
        return jsonify({'message': 'Workplace risk not found'}), 404
    controls = AdditionalControl.query.filter_by(risk_id=risk_id).all()
    return jsonify([{'id': control.id, 'responsible_person': control.responsible_person, 'completion_date': control.completion_date.strftime('%Y-%m-%d')} for control in controls]), 200

@app.route('/risks/<int:risk_id>/controls', methods=['POST'])
@token_required
def add_additional_control(current_user, risk_id):
    risk = WorkplaceRisk.query.filter_by(id=risk_id).join(Document).filter(Document.user_id == current_user.id).first()
    if not risk:
        return jsonify({'message': 'Workplace risk not found'}), 404
    data = request.get_json()
    new_control = AdditionalControl(
        responsible_person=data['responsible_person'],
        completion_date=datetime.strptime(data['completion_date'], '%Y-%m-%d'),
        risk_id=risk_id
    )
    db.session.add(new_control)
    db.session.commit()
    return jsonify({'message': 'Additional control added', 'id': new_control.id}), 201

@app.route('/controls/<int:control_id>', methods=['DELETE'])
@token_required
def delete_additional_control(current_user, control_id):
    control = AdditionalControl.query.filter_by(id=control_id).join(WorkplaceRisk).join(Document).filter(Document.user_id == current_user.id).first()
    if not control:
        return jsonify({'message': 'Additional control not found'}), 404
    db.session.delete(control)
    db.session.commit()
    return jsonify({'message': 'Additional control deleted'})

@app.route('/controls/<int:control_id>', methods=['PUT'])
@token_required
def update_additional_control(current_user, control_id):
    control = AdditionalControl.query.filter_by(id=control_id).join(WorkplaceRisk).join(Document).filter(Document.user_id == current_user.id).first()
    if not control:
        return jsonify({'message': 'Additional control not found'}), 404
    data = request.get_json()
    control.responsible_person = data.get('responsible_person', control.responsible_person)
    if 'completion_date' in data:
        control.completion_date = datetime.strptime(data['completion_date'], '%Y-%m-%d')
    db.session.commit()
    return jsonify({'message': 'Additional control updated'})
# Ensure the application context is pushed before creating tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
