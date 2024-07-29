import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CiudadesService } from '../ciudades.service';
import { DataGeneralService } from '../data-general.service';
import Validation from '../utils/validation';

@Component({
  selector: 'app-rips-json',
  templateUrl: './rips-json.component.html',
  styleUrls: ['./rips-json.component.css']
})
export class RipsJsonComponent implements OnInit {
  form: FormGroup = new FormGroup({
    numFactura: new FormControl(''),
    tipoNota: new FormControl(''),
    numNota: new FormControl(''),

    tipoDocumento: new FormControl(''),
    numDocumento: new FormControl(''),
    tipoUsuario: new FormControl(''),
    fecNacimiento: new FormControl(''),
    sexo: new FormControl(''),
    municipio: new FormControl(''),
    zonaResidencia: new FormControl(''),
    incapacidad: new FormControl(''),
  });
  submitted = false;
  now = new Date();
  json:any[] = [];
  ciudades: any[] = [];
  datosClinica: any[] = [];
  nombreClinica = "";
  arrayConsultas: any[] = [];
  arrayProcedimientos: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private ciudadesService: CiudadesService,
    private dataGeneralService: DataGeneralService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      numFactura: ['OE880', [Validators.required]],
      tipoNota: ['null', [Validators.required]],
      numNota: ['', []],

      tipoDocumento: ['CC', []],
      numDocumento: ['1110450150', [Validators.required]],
      tipoUsuario: ['10', []],
      fecNacimiento: ['1997-07-15', [Validators.required]],
      sexo: ['M', []],
      municipio: ['17380', []],
      zonaResidencia: ['02', []],
      incapacidad: ['NO', []],
    });
    this.ciudadesService.getData().subscribe(data => {
      this.ciudades = data;
    });
    this.dataGeneralService.getData().subscribe(data => {
      this.datosClinica = data.clinica;
      this.nombreClinica = this.datosClinica[0].nombre;

    });
  };

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.json = [];
    this.submitted = true;

    if (this.form.invalid) {
      console.log(this.form.invalid);
      return;
    }

    this.createJsonTransaccion();
    this.createUsersJson();
    this.createServices();
    console.log(JSON.stringify(this.json, null, 2));
    // console.log(JSON.stringify(this.arrayConsultas, null, 2));

  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

  createJsonTransaccion(): void {
    const newValue = {
        "numDocumentoIdObligado": this.datosClinica[0].nit,
        "numFactura": this.form.value.numFactura,
        "tipoNota": this.form.value.tipoNota,
        "numNota": this.form.value.numNota,
      };
    this.json.push(newValue);
  }

  createUsersJson(): void {
    const newValue = [
        {
        "tipoDocumentoIdentificacion": this.form.value.tipoDocumento,
        "numDocumentoIdentificacion": this.form.value.numDocumento,
        "tipoUsuario": this.form.value.tipoUsuario,
        "fechaNacimiento": this.form.value.fecNacimiento,
        "codSexo": this.form.value.sexo,
        "codPaisResidencia": "170",
        "codMunicipioResidencia": this.form.value.municipio,
        "codZonaTerritorialResidencia": this.form.value.zonaResidencia,
        "incapacidad": this.form.value.incapacidad,
        "consecutivo": 1,
        "codPaisOrigen": "170"
        }
      ];
    this.json.push("usuarios", newValue);
  }

  getConsultas(event:any): void {
    this.arrayConsultas = event;
  }

  getProcedimientos(event:any): void {
    this.arrayProcedimientos = event;
  }

  createServices(): void {
    const newValue = {
      "consultas": this.createConsultas(),
      "medicamentos": [],
      "procedimientos": this.createProcedimientos(),
      "urgencias": [],
      "hospitalizacion": [],
      "recienNacidos": [],
      "otrosServicios": []
      }
    this.json.push("servicios", newValue);
  }

  createConsultas(): any[] {
    let newArray:any[] = [];
    let i = 1;
    this.arrayConsultas.map((consulta) => {
      const newValue = {
        "codPrestador": this.datosClinica[0].codigo,
        "fechaInicioAtencion": consulta.fecConsulta + " " + consulta.horaConsulta,
        "numAutorizacion": null,
        "codConsulta": consulta.codConsulta,
        "modalidadGrupoServicioTecSal": "01",
        "grupoServicios": "01",
        "codServicio": 334,
        "finalidadTecnologiaSalud": consulta.tipoDx,
        "causaMotivoAtencion": "23", // Accidente de tránsito de origen común
        "codDiagnosticoPrincipal": consulta.dxPrincipal,
        "codDiagnosticoRelacionado1": consulta.dxRelacionado1,
        "codDiagnosticoRelacionado2": null,
        "codDiagnosticoRelacionado3": null,
        "tipoDiagnosticoPrincipal": consulta.tipoDxConsulta,
        "tipoDocumentoIdentificacion": consulta.tipoDocumentoMedico,
        "numDocumentoIdentificacion": consulta.documentoMedico,
        "vrServicio": consulta.valor,
        "conceptoRecaudo": "05",
        "valorPagoModerador": 0,
        "numFEVPagoModerador": null,
        "consecutivo": i++,
      }
      newArray.push(newValue);
    });
    return newArray;
  }

  createProcedimientos(): any[] {
    let newArray:any[] = [];
    let i = 1;
    this.arrayProcedimientos.map((dato) => {
      const newValue = {
        "codPrestador": this.datosClinica[0].codigo,
        "fechaInicioAtencion": dato.fecProcedimiento + " " + dato.horaProcedimiento,
        "idMIPRES": null,
        "numAutorizacion": null,
        "codProcedimiento": dato.codProcedimiento,
        "viaIngresoServicioSalud": dato.viaIngreso,
        "modalidadGrupoServicioTecSal": "01",
        "grupoServicios": "01",
        "codServicio": dato.tipoProcedimiento,
        "finalidadTecnologiaSalud": dato.tipoDx,
        "tipoDocumentoIdentificacion": dato.tipoDocumentoMedico,
        "numDocumentoIdentificacion": dato.documentoMedico,
        "codDiagnosticoPrincipal": dato.dxPrincipal,
        "codDiagnosticoRelacionado": dato.dxRelacionado1,
        "codComplicacion": "",
        "vrServicio": dato.valor,
        "conceptoRecaudo": "04",
        "valorPagoModerador": 0,
        "numFEVPagoModerador": null,
        "consecutivo": i++,
      }
      newArray.push(newValue);
    });
    return newArray;

  }
}
