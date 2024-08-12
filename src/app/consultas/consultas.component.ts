import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataGeneralService } from '../data-general.service';
import Validation from '../utils/validation';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css']
})
export class ConsultasComponent implements OnInit {
  @Output() sendConsultas = new EventEmitter<any[]>();
  form: FormGroup = new FormGroup({
    fecConsulta: new FormControl(''),
    horaConsulta: new FormControl(''),
    codConsulta: new FormControl(''),
    valorConsulta: new FormControl(''),
    tipoConsulta: new FormControl(''),
    tipoDx: new FormControl(''),
    dxPrincipal: new FormControl(''),
    dxRelacionado1: new FormControl(''),
    tipoDxConsulta: new FormControl('')

  });
  currentDate = new Date().toISOString().substring(0, 10);
  currentTime = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
  consultas:any[] = [];
  lastId = 0;
  submitted = false;
  datosClinica: any[] = [];
  serviciosClinica: any[] = [];
  consultasClinica: any[] = [];
  dxClinica: any[] = [];
  nombreMedico = '';
  documentoMedico = '';
  tipoDocumentoMedico = '';
  valorOutput = 0;
  items = 0;

  constructor(
    private formBuilder: FormBuilder,
    private dataGeneralService: DataGeneralService
  ) { }

  ngOnInit(): void {
    console.log("consultasComponent@ngOnInit");

    this.form = this.formBuilder.group({
      fecConsulta: [this.currentDate, [Validators.required]],
      horaConsulta: [this.currentTime, [Validators.required]],
      codConsulta: ['', [Validators.required]],
      valorConsulta: ['0', [Validators.required]],
      tipoConsulta: ['334', []],
      tipoDx: ['15', []],
      dxPrincipal: ['S025', [Validators.required]],
      dxRelacionado1: ['K040', [Validators.required]],
      tipoDxConsulta: ['2', []]
    });
    this.dataGeneralService.getData().subscribe(data => {
      this.serviciosClinica = data.servicios;
      this.consultasClinica = data.consultas;
      this.dxClinica = data.diagnosticos;
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.searchMD();
    this.lastId++
    const newValueWithId = {
      ...this.form.value,
      nombreMedico: this.nombreMedico,
      documentoMedico: this.documentoMedico,
      tipoDocumentoMedico: this.tipoDocumentoMedico,
      valor: this.valorOutput,
      id: this.lastId
    };
    this.consultas.push(newValueWithId);
    this.items= this.consultas.length;

    // console.log(JSON.stringify(this.consultas, null, 2));
    this.sendConsultas.emit(this.consultas);
  }

  onRemove(id:number): void {
    this.submitted = false;
    this.consultas = this.consultas.filter(consulta => consulta.id !== id);
    console.log(JSON.stringify(this.consultas, null, 2));
    this.items= this.consultas.length;
    // this.sendConsultas.emit(this.json);
  }

  searchMD(): void {
    this.nombreMedico = "";
    this.documentoMedico = "";
    this.tipoDocumentoMedico = "";

    const val = this.serviciosClinica.filter(servicio => servicio.codigo === this.form.value.tipoConsulta);
    this.nombreMedico = val[0].medico.nombre;
    this.documentoMedico = val[0].medico.documento;
    this.tipoDocumentoMedico = val[0].medico.tipoDocumento;
  }

  searchValue(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.form.value.valorConsulta = '';

    if(selectedValue == ""){
      this.valorOutput = 0;
      return;
    }
    const val = this.consultasClinica.filter(consulta => consulta.codigo === selectedValue);
    this.valorOutput = val[0].precio;
    // this.form.value.valorConsulta = val[0].precio;
  }

}
