import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Validation from '../utils/validation';

@Component({
  selector: 'app-rips-form',
  templateUrl: './rips-form.component.html',
  styleUrls: ['./rips-form.component.css']
})
export class RipsFormComponent implements OnInit {
  form: FormGroup = new FormGroup({
    numFactura: new FormControl(''),
    fecFactura: new FormControl(''),
    valFactura: new FormControl(''),
    codEntidad: new FormControl(''),
    nomEntidad: new FormControl(''),
    numContrato: new FormControl(''),
    planBeneficios: new FormControl(''),
    numPoliza: new FormControl(''),

    tipoDocumento: new FormControl(''),
    numDocumento: new FormControl(''),
    tipoUsuarioJson: new FormControl(''),
    tipoUsuarioCsv: new FormControl(''),
    priNombre: new FormControl(''),
    segNombre: new FormControl(''),
    priApellido: new FormControl(''),
    segApellido: new FormControl(''),
    fecNacimiento: new FormControl(''),
    sexo: new FormControl(''),
    zonaResidencia: new FormControl(''),
    incapacidad: new FormControl(''),
  });
  submitted = false;
  now = new Date();
  json:any[] = [];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      numFactura: ['OE880', [Validators.required]],
      fecFactura: ['2024-07-15', [Validators.required]],
      valFactura: ['5684100', [Validators.required]],
      codEntidad: ['13-17', [Validators.required]],
      nomEntidad: ['COMPAÑIA MUNDIAL DE SEGUROS SA', [Validators.required]],
      numContrato: ['85678124', [Validators.required]],
      planBeneficios: ['', []],
      numPoliza: ['', []],

      tipoDocumento: ['CC', []],
      numDocumento: ['1110450150', [Validators.required]],
      tipoUsuarioJson: ['10', []],
      tipoUsuarioCsv: ['5', []],
      priNombre: ['JULIO', [Validators.required]],
      segNombre: ['CESAR', []],
      priApellido: ['MENDOZA', [Validators.required]],
      segApellido: ['TABARES', [Validators.required]],
      fecNacimiento: ['1997-07-15', [Validators.required]],
      sexo: ['M', []],
      zonaResidencia: ['02', []],
      incapacidad: ['NO', []],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      console.log(this.form.invalid);

      return;
    }

    this.createUsersJson();
  }

  createCSV(): void {
    const newValue = {
      "factura":{
        "numero": this.form.value.numFactura,
        "fecha": this.form.value.fecFactura,
        "cod_entidad": this.form.value.codEntidad,
        "nombre_entidad": this.form.value.nomEntidad,
        "num_contrato": this.form.value.numContrato,
        "plan_beneficios": this.form.value.planBeneficios,
        "num_poliza": this.form.value.numPoliza,
        "valor": this.form.value.valFactura
      },

    };
    this.json.push(newValue);
    console.log(JSON.stringify(this.json, null, 2));
    // console.log(JSON.stringify(this.form.value, null, 2));
  }


  createUsersJson(): void {
    const newValue = {
      "usuarios": [
        {
        "tipoDocumentoIdentificacion": this.form.value.tipoDocumento,
        "numDocumentoIdentificacion": this.form.value.numDocumento,
        "tipoUsuario": this.form.value.tipoUsuarioJson,
        "fechaNacimiento": this.form.value.fecNacimiento,
        "codSexo": this.form.value.sexo,
        "codPaisResidencia": "170",
        "codMunicipioResidencia": "17380", // La dorada
        "codZonaTerritorialResidencia": this.form.value.zonaResidencia,
        "incapacidad": this.form.value.incapacidad,
        "consecutivo": 1,
        "codPaisOrigen": "170"
        }
      ]

    };
    this.json.push(newValue);
    console.log(JSON.stringify(this.json, null, 2));
    // console.log(JSON.stringify(this.form.value, null, 2));
  }

  createUsersCSV(): void {
    const newValue = {
      "usuario":{
        "tipo_documento": this.form.value.tipoDocumento,
        "num_documento": this.form.value.numDocumento,
        "edad": this.form.value.edad,
        "sexo": this.form.value.sexo,
        "pri_nombre": this.form.value.priNombre,
        "seg_nombre": this.form.value.segNombre,
        "pri_apellido": this.form.value.priApellido,
        "seg_apellido": this.form.value.segApellido,
        
      }
    }
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
}
