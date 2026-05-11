from fastapi import FastAPI, Path, HTTPException,Query
from fastapi.responses import JSONResponse
from typing import Annotated,Literal,computed_field,Optional
from pydantic import BaseModel,Field
import json

#app
app = FastAPI()

# pydantic new class
class Patient(BaseModel):

    id:Annotated[str,Field(...,description='ID of the patient',example=['P001'])]
    name: Annotated[str, Field(...,description="Name of the Patient")]
    city:Annotated[str,Field(...,description='City of the patient')]
    age:Annotated[int,Field(...,gt=0,lt=120,description='Age of the patient')]
    gender:Annotated[Literal['male','female','others'],Field(...,description='Patient gender')]
    height:Annotated[float,Field(...,description='Patient height')]
    weight:Annotated[float,Field(...,description='Patient weight')]

    @computed_field
    @property
    def bmi(self)->float:
        bmi=(self.weight/(self.height**2),2)
        return bmi
    
    @computed_field
    @property
    def verdict(self)->str:

        if self.bmi < 18.5:
            return 'UnderWeight'
        elif self.bmi < 25:
            return 'Normal'
        elif self.bmi < 30:
            return 'Normal'
        else:
            return 'Obese'
    
# pydantic update class
class PatientUpdate(BaseModel):
    name:Annotated[Optional[str],Field(default=None)]
    city:Annotated[Optional[str],Field(default=None)]
    age:Annotated[Optional[int],Field(default=None,gt=0)]
    gender:Annotated[Optional[Literal['male','female']],Field(default=None)]
    height:Annotated[Optional[float],Field(default=None,gt=0)]
    weight:Annotated[Optional[float],Field(default=None,gt=0)]

# helper functions

def load_data():
    with open("patients.json",'r') as f:
        data=json.load(f)

    return data

def save_data(data):
    with open("patients.json",'w') as f:
        json.dump(data, f, indent=2)

# ---- API routes ----

# Get home 
@app.get("/")
def greet():
    return {'message':'Patient Management'}

# Get about the page
@app.get("/about")
def about():
    return{'message':'fullt funtionable api (patient)'}

# Get all data
@app.get("/view")
def view():
    data = load_data()
    return data

# Get  patient by id
@app.get('/patient/{patient_id}')
def view_patient(patient_id: str= Path(...,description='ID of the patient in the DB',example='P001')):
    data = load_data()
    if patient_id in data:
        return data[patient_id]
    raise HTTPException(sattus_code=404, detail='Patient not found')

# Get sorted data
@app.get('/sort')
def sort_patients(sort_by:str = Query(..., description='Sort on the bosis of the height,weight or BMI'),order: str = Query('asc',description='sort in asc or desc order')):
    
    valid_fields = ['height','weight','bmi']
    
    if sort_by not in valid_fields:
        raise HTTPException(status_code = 400 ,detail=f'Invalid field select from {valid_fields}')
    
    if order not in ['asc','desc']:
        raise HTTPException(status_code = 400 ,detail='Invalid order select between asc or desc')
    
    data = load_data()

    sort_order = True if order == 'desc' else False
    sorted_data = sorted(data.values(),key=lambda x:x.get(sort_by,0), reverse=sort_order)

    return sorted_data

# Post data
@app.post('/create')
def create_patient(patient: Patient):
    data=load_data()

    if patient.id in data:
        raise HTTPException(status_code=400,detail='Patient already exist')
    
    data[patient.id]=patient.model_dump(exclude=['id'])
    save_data(data)
    
    return JSONResponse(status_code=201,content={'message':'patient created successfully'}) 
