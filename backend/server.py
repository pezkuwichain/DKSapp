from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict
import uuid
from datetime import datetime
import hashlib
import secrets


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ============= MODELS =============

class User(BaseModel):
    user_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: Optional[EmailStr] = None
    wallet_address: str
    hez_balance: float = 0.0
    pez_balance: float = 0.0
    trust_score: int = 100
    is_citizen: bool = False
    kyc_status: str = "not_started"  # not_started, pending, approved
    kyc_hash: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    email: Optional[EmailStr] = None
    preferred_language: str = "en"

class UserLogin(BaseModel):
    wallet_address: str

class Transaction(BaseModel):
    transaction_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    from_address: str
    to_address: str
    amount: float
    token_type: str  # "HEZ" or "PEZ"
    status: str = "completed"  # pending, completed, failed
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class TransactionCreate(BaseModel):
    to_address: str
    amount: float
    token_type: str

class KYCSubmission(BaseModel):
    full_name: str
    date_of_birth: str
    nationality: str
    document_type: str
    # Note: Actual document images handled separately for security

class TrustScoreBreakdown(BaseModel):
    base_score: int = 100
    citizen_bonus: int = 0
    education_bonus: int = 0
    governance_bonus: int = 0
    validator_bonus: int = 0
    total_score: int = 100

class Proposal(BaseModel):
    proposal_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: str  # governance, treasury, technical
    votes_for: int = 0
    votes_against: int = 0
    status: str = "active"  # active, passed, rejected
    created_at: datetime = Field(default_factory=datetime.utcnow)
    ends_at: datetime

class Vote(BaseModel):
    vote_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    proposal_id: str
    user_id: str
    vote_type: str  # "for" or "against"
    voting_power: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Course(BaseModel):
    course_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    difficulty: str  # beginner, intermediate, advanced
    duration_hours: int
    trust_score_reward: int
    enrolled_count: int = 0

class Enrollment(BaseModel):
    enrollment_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    course_id: str
    progress: int = 0  # 0-100
    completed: bool = False
    enrolled_at: datetime = Field(default_factory=datetime.utcnow)


# ============= HELPER FUNCTIONS =============

def generate_wallet_address():
    """Generate a simulated wallet address"""
    return "0x" + secrets.token_hex(20)

def generate_kyc_hash(data: dict):
    """Generate a hash for KYC data"""
    data_str = str(sorted(data.items()))
    return hashlib.sha256(data_str.encode()).hexdigest()

def calculate_trust_score(user: dict) -> int:
    """Calculate user's trust score based on various factors"""
    base_score = 100
    citizen_bonus = 400 if user.get('is_citizen') else 0
    
    # Additional bonuses from activities
    completed_courses = 0  # Would query from enrollments
    governance_votes = 0  # Would query from votes
    
    education_bonus = completed_courses * 10
    governance_bonus = governance_votes * 5
    
    total_score = base_score + citizen_bonus + education_bonus + governance_bonus
    return total_score


# ============= AUTH ENDPOINTS =============

@api_router.post("/auth/signup")
async def signup(user_input: UserCreate):
    """Create a new user with wallet"""
    wallet_address = generate_wallet_address()
    
    user_dict = {
        "user_id": str(uuid.uuid4()),
        "email": user_input.email,
        "wallet_address": wallet_address,
        "hez_balance": 1000.0,  # Initial airdrop
        "pez_balance": 100.0,   # Initial airdrop
        "trust_score": 100,
        "is_citizen": False,
        "kyc_status": "not_started",
        "kyc_hash": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    await db.users.insert_one(user_dict)
    return {
        "success": True,
        "user_id": user_dict["user_id"],
        "wallet_address": wallet_address,
        "message": "Account created successfully"
    }

@api_router.post("/auth/login")
async def login(login_data: UserLogin):
    """Login with wallet address"""
    user = await db.users.find_one({"wallet_address": login_data.wallet_address})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user['_id'] = str(user['_id'])
    return {"success": True, "user": user}


# ============= USER ENDPOINTS =============

@api_router.get("/user/{user_id}")
async def get_user(user_id: str):
    """Get user details"""
    user = await db.users.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user['_id'] = str(user['_id'])
    return user

@api_router.get("/user/{user_id}/wallet")
async def get_wallet(user_id: str):
    """Get user wallet balance"""
    user = await db.users.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "wallet_address": user["wallet_address"],
        "hez_balance": user["hez_balance"],
        "pez_balance": user["pez_balance"]
    }


# ============= TRUST SCORE ENDPOINTS =============

@api_router.get("/trust-score/{user_id}")
async def get_trust_score(user_id: str):
    """Get detailed trust score breakdown"""
    user = await db.users.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Calculate breakdown
    base_score = 100
    citizen_bonus = 400 if user.get('is_citizen') else 0
    
    # Query user activities
    completed_courses = await db.enrollments.count_documents({
        "user_id": user_id,
        "completed": True
    })
    
    votes_cast = await db.votes.count_documents({"user_id": user_id})
    
    education_bonus = completed_courses * 50
    governance_bonus = votes_cast * 10
    
    total_score = base_score + citizen_bonus + education_bonus + governance_bonus
    
    return {
        "base_score": base_score,
        "citizen_bonus": citizen_bonus,
        "education_bonus": education_bonus,
        "governance_bonus": governance_bonus,
        "validator_bonus": 0,
        "total_score": total_score
    }


# ============= KYC ENDPOINTS =============

@api_router.post("/kyc/submit/{user_id}")
async def submit_kyc(user_id: str, kyc_data: KYCSubmission):
    """Submit KYC data and approve citizenship"""
    user = await db.users.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Generate hash for KYC data
    kyc_hash = generate_kyc_hash(kyc_data.dict())
    
    # Update user to citizen
    updated_trust_score = calculate_trust_score({**user, 'is_citizen': True})
    
    await db.users.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "is_citizen": True,
                "kyc_status": "approved",
                "kyc_hash": kyc_hash,
                "trust_score": updated_trust_score,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {
        "success": True,
        "message": "Citizenship approved",
        "kyc_hash": kyc_hash,
        "new_trust_score": updated_trust_score
    }


# ============= TRANSACTION ENDPOINTS =============

@api_router.post("/transactions/{user_id}")
async def create_transaction(user_id: str, tx_data: TransactionCreate):
    """Send tokens to another address"""
    user = await db.users.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check balance
    balance_key = "hez_balance" if tx_data.token_type == "HEZ" else "pez_balance"
    if user[balance_key] < tx_data.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    # Deduct from sender
    await db.users.update_one(
        {"user_id": user_id},
        {"$inc": {balance_key: -tx_data.amount}}
    )
    
    # Create transaction record
    transaction = {
        "transaction_id": str(uuid.uuid4()),
        "from_address": user["wallet_address"],
        "to_address": tx_data.to_address,
        "amount": tx_data.amount,
        "token_type": tx_data.token_type,
        "status": "completed",
        "timestamp": datetime.utcnow()
    }
    
    await db.transactions.insert_one(transaction)
    
    return {"success": True, "transaction": transaction}

@api_router.get("/transactions/{user_id}")
async def get_transactions(user_id: str):
    """Get user transaction history"""
    user = await db.users.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    transactions = await db.transactions.find({
        "$or": [
            {"from_address": user["wallet_address"]},
            {"to_address": user["wallet_address"]}
        ]
    }).sort("timestamp", -1).limit(50).to_list(50)
    
    for tx in transactions:
        tx['_id'] = str(tx['_id'])
    
    return transactions


# ============= GOVERNANCE ENDPOINTS =============

@api_router.get("/governance/proposals")
async def get_proposals():
    """Get all active proposals"""
    proposals = await db.proposals.find({"status": "active"}).to_list(100)
    for p in proposals:
        p['_id'] = str(p['_id'])
    return proposals

@api_router.post("/governance/vote/{user_id}")
async def cast_vote(user_id: str, proposal_id: str, vote_type: str):
    """Cast a vote on a proposal"""
    user = await db.users.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not user.get('is_citizen'):
        raise HTTPException(status_code=403, detail="Only citizens can vote")
    
    # Check if already voted
    existing_vote = await db.votes.find_one({
        "user_id": user_id,
        "proposal_id": proposal_id
    })
    
    if existing_vote:
        raise HTTPException(status_code=400, detail="Already voted on this proposal")
    
    # Create vote
    vote = {
        "vote_id": str(uuid.uuid4()),
        "proposal_id": proposal_id,
        "user_id": user_id,
        "vote_type": vote_type,
        "voting_power": user["trust_score"],
        "timestamp": datetime.utcnow()
    }
    
    await db.votes.insert_one(vote)
    
    # Update proposal counts
    update_field = "votes_for" if vote_type == "for" else "votes_against"
    await db.proposals.update_one(
        {"proposal_id": proposal_id},
        {"$inc": {update_field: user["trust_score"]}}
    )
    
    return {"success": True, "vote": vote}


# ============= EDUCATION ENDPOINTS =============

@api_router.get("/education/courses")
async def get_courses():
    """Get all available courses"""
    courses = await db.courses.find().to_list(100)
    for c in courses:
        c['_id'] = str(c['_id'])
    return courses

@api_router.post("/education/enroll/{user_id}")
async def enroll_course(user_id: str, course_id: str):
    """Enroll in a course"""
    user = await db.users.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not user.get('is_citizen'):
        raise HTTPException(status_code=403, detail="Only citizens can access education")
    
    # Check if already enrolled
    existing = await db.enrollments.find_one({
        "user_id": user_id,
        "course_id": course_id
    })
    
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled")
    
    enrollment = {
        "enrollment_id": str(uuid.uuid4()),
        "user_id": user_id,
        "course_id": course_id,
        "progress": 0,
        "completed": False,
        "enrolled_at": datetime.utcnow()
    }
    
    await db.enrollments.insert_one(enrollment)
    
    return {"success": True, "enrollment": enrollment}

@api_router.get("/education/my-courses/{user_id}")
async def get_my_courses(user_id: str):
    """Get user's enrolled courses"""
    enrollments = await db.enrollments.find({"user_id": user_id}).to_list(100)
    for e in enrollments:
        e['_id'] = str(e['_id'])
    return enrollments


# ============= FEATURE CHECK ENDPOINT =============

@api_router.get("/features/check/{user_id}")
async def check_feature_access(user_id: str, feature: str):
    """Check if user has access to a feature"""
    user = await db.users.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Public features (always accessible)
    public_features = ["send", "receive", "exchange", "projects", "foundation"]
    
    # Gated features (require citizenship)
    gated_features = ["welati", "perwerde", "health", "social", "diaspora", 
                      "validator", "stake", "governance", "treasury"]
    
    if feature in public_features:
        return {"has_access": True, "is_citizen": user.get('is_citizen')}
    
    if feature in gated_features:
        return {
            "has_access": user.get('is_citizen', False),
            "is_citizen": user.get('is_citizen'),
            "requires_citizenship": True
        }
    
    return {"has_access": False, "message": "Unknown feature"}


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "PezkuwiChain API - Blockchain for Kurdish Nation"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
