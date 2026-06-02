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
    codigoSIRAS: new FormControl(''),
    fecNacimiento: new FormControl(''),
    sexo: new FormControl(''),
    municipio: new FormControl(''),
    zonaResidencia: new FormControl(''),
    incapacidad: new FormControl(''),
  });
  submitted = false;
  now = new Date();
  json: any[] = [];
  ciudades: any[] = [];
  datosClinica: any[] = [];
  nombreClinica = "";
  arrayConsultas: any[] = [];
  arrayProcedimientos: any[] = [];
  arrayOtrosServicios: any[] = [];
  numeroFactura = "";
  tConsultas = 0;
  tProcedimientos = 0;
  tServicios = 0;
  totalFactura = 0;

  constructor(
    private formBuilder: FormBuilder,
    private ciudadesService: CiudadesService,
    private dataGeneralService: DataGeneralService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      numFactura: ['', [Validators.required]],
      tipoNota: ['null', [Validators.required]],
      numNota: ['', []],

      tipoDocumento: ['CC', []],
      numDocumento: ['', [Validators.required]],
      tipoUsuario: ['10', []],
      codigoSIRAS: ['', []],
      fecNacimiento: ['', [Validators.required]],
      sexo: ['M', []],
      municipio: ['17380', []],
      zonaResidencia: ['02', []],
      incapacidad: ['NO', []],
    });
    this.actualizarValidacionCodigoSIRAS(this.form.value.tipoUsuario);
    this.form.get('tipoUsuario')?.valueChanges.subscribe((tipoUsuario) => {
      this.actualizarValidacionCodigoSIRAS(tipoUsuario);
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

  actualizarValidacionCodigoSIRAS(tipoUsuario: string): void {
    const codigoSIRAS = this.form.get('codigoSIRAS');
    if (!codigoSIRAS) {
      return;
    }
    if (tipoUsuario === '10') {
      codigoSIRAS.setValidators([Validators.required, Validators.pattern(/.*\S.*/)]);
    } else {
      codigoSIRAS.clearValidators();
    }
    codigoSIRAS.updateValueAndValidity();
  }

  onSubmit(): void {
    this.json = [];
    this.submitted = true;

    if (this.form.invalid) {
      const firstInvalidControl: HTMLElement = Object.keys(this.form.controls)
        .filter(key => this.form.controls[key].invalid)
        .map(key => document.querySelector(`[formControlName="${key}"]`))
        .find(control => !!control) as HTMLElement;

      firstInvalidControl?.focus();
      return;
    }

    this.temporaryMethode();

    this.downloadRequestObject();
  }

  temporaryMethode(): void {

    this.numeroFactura = this.form.value.numFactura;
    // Crear los arrays primero
    const consultas = this.createConsultas();
    const procedimientos = this.createProcedimientos();
    const otrosServicios = this.createOtrosServicios();

    // Construir el objeto servicios solo con los que tengan datos
    const servicios: any = {};
    if (consultas.length > 0) {
      servicios.consultas = consultas;
    }
    if (procedimientos.length > 0) {
      servicios.procedimientos = procedimientos;
    }
    if (otrosServicios.length > 0) {
      servicios.otrosServicios = otrosServicios;
    }

    const newValue = {
      "numDocumentoIdObligado": this.datosClinica[0].nit,
      "numFactura": this.form.value.numFactura,
      "tipoNota": this.form.value.tipoNota != "null" ? this.form.value.tipoNota : null,
      "numNota": this.form.value.numNota != "" ? this.form.value.numNota : null,
      "usuarios": [
        {
          "tipoDocumentoIdentificacion": this.form.value.tipoDocumento,
          "numDocumentoIdentificacion": this.form.value.numDocumento,
          "consecutivo": 1,
          "tipoUsuario": this.form.value.tipoUsuario,
          "registroSIRAS": this.form.value.tipoUsuario === '10' ? this.form.value.codigoSIRAS : null,
          "fechaNacimiento": this.form.value.fecNacimiento,
          "codSexo": this.form.value.sexo,
          "codPaisResidencia": "170",
          "codMunicipioResidencia": this.form.value.municipio,
          "codZonaTerritorialResidencia": this.form.value.zonaResidencia,
          "incapacidad": this.form.value.incapacidad,
          "codPaisOrigen": "170",
          "servicios": servicios,
        }
      ]

    };
    this.json.push(newValue);
  }

  convertToJsonFile() {
    const jsonString = JSON.stringify(this.json[0], null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    return blob;
  }

  downloadRequestObject() {
    const blob = this.convertToJsonFile();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RIPS_${this.numeroFactura}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

  limpiarFormulario(): void {
    this.onReset();
    this.arrayConsultas = [];
    this.arrayProcedimientos = [];
    this.arrayOtrosServicios = [];
    this.tConsultas = 0;
    this.tProcedimientos = 0;
    this.tServicios = 0;
    this.totalFactura = 0;
    window.location.reload();
  }

  getConsultas(event: any): void {
    this.arrayConsultas = event;
  }

  getSubtotalConsultas(event: any): void {
    this.tConsultas = Number(event);
    this.sumar();
  }

  getProcedimientos(event: any): void {
    this.arrayProcedimientos = event;
  }

  getSubtotalProcedimientos(event: any): void {
    this.tProcedimientos = Number(event);
    this.sumar();
  }

  getOtrosServicios(event: any): void {
    this.arrayOtrosServicios = event;
  }

  getSubtotalServicios(event: any): void {
    this.tServicios = Number(event);
    this.sumar();
  }

  sumar(): void {
    this.totalFactura = this.tConsultas + this.tProcedimientos + this.tServicios;
  }

  createConsultas(): any[] {
    let newArray: any[] = [];
    let i = 1;

    this.arrayConsultas.map((consulta) => {
      const newValue = {
        "codPrestador": this.datosClinica[0].codigo,
        "fechaInicioAtencion": consulta.fecConsulta + " " + consulta.horaConsulta,
        "codConsulta": consulta.codConsulta,
        "numAutorizacion": null,
        "modalidadGrupoServicioTecSal": "01",
        "grupoServicios": "01",
        "finalidadTecnologiaSalud": consulta.tipoDx,
        "causaMotivoAtencion": "23", // Accidente de tránsito de origen común
        "codServicio": 334,
        "codDiagnosticoPrincipal": consulta.dxPrincipal,
        "tipoDiagnosticoPrincipal": "0" + consulta.tipoDxConsulta,
        "codDiagnosticoRelacionado1": consulta.dxRelacionado1 != 0 ? consulta.dxRelacionado1 : null,
        "codDiagnosticoRelacionado2": null,
        "codDiagnosticoRelacionado3": null,
        "tipoDocumentoIdentificacion": consulta.tipoDocumentoMedico,
        "numDocumentoIdentificacion": consulta.documentoMedico,
        "vrServicio": parseInt(consulta.valorConsulta),
        "conceptoRecaudo": "05",
        "valorPagoModerador": 0,
        "numFEVPagoModerador": null,
        "consecutivo": i++
      }
      newArray.push(newValue);
    });
    return newArray;
  }

  createProcedimientos(): any[] {
    let newArray: any[] = [];
    let i = 1;
    this.arrayProcedimientos.map((dato) => {
      const newValue = {
        "codPrestador": this.datosClinica[0].codigo,
        "fechaInicioAtencion": dato.fecha + " " + dato.hora,
        "idMIPRES": null,
        "numAutorizacion": null,
        "codProcedimiento": dato.codigo,
        "viaIngresoServicioSalud": dato.viaIngreso,
        "modalidadGrupoServicioTecSal": "01",
        "grupoServicios": "01",
        "codServicio": parseInt(dato.tipoProcedimiento),
        "finalidadTecnologiaSalud": dato.tipoDx,
        "tipoDocumentoIdentificacion": dato.tipoDocumentoMedico,
        "numDocumentoIdentificacion": dato.documentoMedico,
        "codDiagnosticoPrincipal": dato.dxPrincipal,
        "codDiagnosticoRelacionado": dato.dxRelacionado1,
        "codComplicacion": "S025",
        "vrServicio": parseInt(dato.valor.toString()),
        "conceptoRecaudo": "05",
        "valorPagoModerador": 0,
        "numFEVPagoModerador": null,
        "consecutivo": i++
      }
      newArray.push(newValue);
    });
    return newArray;

  }

  createOtrosServicios(): any[] {
    let newArray: any[] = [];
    let i = 1;
    this.arrayOtrosServicios.map((dato) => {
      const newValue = {
        "codPrestador": this.datosClinica[0].codigo,
        "numAutorizacion": null,
        "idMIPRES": null,
        "fechaSuministroTecnologia": dato.fecha + " " + dato.hora,
        "tipoOS": "01",
        "codTecnologiaSalud": dato.tecnologia,
        "nomTecnologiaSalud": dato.nomTecnologia,
        "cantidadOS": parseInt(dato.cantidad),
        "tipoDocumentoIdentificacion": dato.tipoDocumentoMedico,
        "numDocumentoIdentificacion": dato.documentoMedico,
        "vrUnitOS": dato.valorunit,
        "vrServicio": dato.valor,
        "conceptoRecaudo": "05",
        "valorPagoModerador": 0,
        "numFEVPagoModerador": null,
        "consecutivo": i++
      }
      newArray.push(newValue);
    });
    return newArray;

  }
}
