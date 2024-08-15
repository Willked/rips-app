import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataGeneralService } from '../data-general.service';

@Component({
  selector: 'app-otros-servicios',
  templateUrl: './otros-servicios.component.html',
  styleUrls: ['./otros-servicios.component.css']
})
export class OtrosServiciosComponent implements OnInit {
  @Output() sendOtrosServicios = new EventEmitter<any[]>();
  form: FormGroup = new FormGroup({
    fecha: new FormGroup(""),
    hora: new FormGroup(""),
    tecnologia: new FormGroup(""),
    cantidad: new FormGroup(""),
    valorunit: new FormGroup(""),
    tipoConsulta: new FormControl('')
  });
  currentDate = new Date().toISOString().substring(0, 10);
  currentTime = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
  otrosArray:any[] = [];
  lastId = 0;
  submitted = false;
  serviciosClinica: any[] = [];
  tecnologia: any[] = [];
  documentoMedico = '';
  tipoDocumentoMedico = '';
  items = 0;

  constructor(
    private formBuilder: FormBuilder,
    private dataGeneralService: DataGeneralService
  ) { }

  ngOnInit(): void {
    console.log("otrosServiciosComponent@ngOnInit");

    this.form = this.formBuilder.group({
      fecha: [this.currentDate, [Validators.required]],
      hora: [this.currentTime, [Validators.required]],
      tecnologia: ['CA1', [Validators.required]],
      cantidad: ['1', [Validators.required, Validators.min(1)]],
      valorunit: ['0', [Validators.required, Validators.min(1)]],
      tipoConsulta: ['334', []]
    });
    this.dataGeneralService.getData().subscribe(data => {
      this.serviciosClinica = data.servicios;
      this.tecnologia = data.tecnologia;
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
    this.lastId++;
    let valorOutput = this.form.value.valorunit*this.form.value.cantidad;

    this.searchMD();
    let newService = {
      id: this.lastId,
      fecha: this.form.value.fecha,
      hora: this.form.value.hora,
      tecnologia: this.form.value.tecnologia,
      nomTecnologia: this.searchTech(this.form.value.tecnologia),
      cantidad: this.form.value.cantidad,
      documentoMedico: this.documentoMedico,
      tipoDocumentoMedico: this.tipoDocumentoMedico,
      valorunit: this.form.value.valorunit,
      valor: valorOutput
    };
    this.items= this.otrosArray.length;
    this.otrosArray.push(newService);
    this.sendOtrosServicios.emit(this.otrosArray);
    this.submitted = false;
  }

  onRemove(id:number): void {
    this.submitted = false;
    this.otrosArray = this.otrosArray.filter(servicio => servicio.id !== id);
    this.items= this.otrosArray.length;
    // console.log(JSON.stringify(this.otrosArray, null, 2));
  }

  searchTech(id:string): void {
    const val = this.tecnologia.filter(servicio => servicio.codigo === id);
    return val[0].nombre;
  }

  searchMD(): void {
    this.documentoMedico = "";
    this.tipoDocumentoMedico = "";

    const val = this.serviciosClinica.filter(servicio => servicio.codigo === this.form.value.tipoConsulta);
    this.documentoMedico = val[0].medico.documento;
    this.tipoDocumentoMedico = val[0].medico.tipoDocumento;
  }
}
