import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataGeneralService } from '../data-general.service';

@Component({
  selector: 'app-procedimientos',
  templateUrl: './procedimientos.component.html',
  styleUrls: ['./procedimientos.component.css']
})
export class ProcedimientosComponent implements OnInit {
  @Output() sendProcedimientos = new EventEmitter<any[]>();
  @Output() sendSubtotal = new EventEmitter<any>();

  form: FormGroup = new FormGroup({
    fecha: new FormGroup(""),
    hora: new FormGroup(""),
    codigo: new FormGroup(""),
    viaIngreso: new FormGroup(""),
    tipoProcedimiento: new FormGroup(""),
    tipoDx: new FormGroup(""),
    valor: new FormGroup("")

  });
  currentDate = new Date().toISOString().substring(0, 10);
  currentTime = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
  procedimientos:any[] = [];
  lastId = 0;
  submitted = false;
  datosClinica: any[] = [];
  serviciosClinica: any[] = [];
  procedimientosClinica: any[] = [];
  dxClinica: any[] = [];
  documentoMedico = '';
  tipoDocumentoMedico = '';
  items = 0;
  totalValue = 0;

  constructor(
    private formBuilder: FormBuilder,
    private dataGeneralService: DataGeneralService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fecha: [this.currentDate, [Validators.required]],
      hora: [this.currentTime, [Validators.required]],
      codigo: ['', [Validators.required]],
      viaIngreso: ['02', [Validators.required]],
      tipoProcedimiento: ['334', []],
      tipoDx: ['15', []],
      dxPrincipal: ['S025', [Validators.required]],
      dxRelacionado1: ['K040', [Validators.required]],
      valor: ['0', [Validators.required, Validators.min(1)]]
    });
    this.dataGeneralService.getData().subscribe(data => {
      this.serviciosClinica = data.servicios;
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
    this.totalValue += Number(this.form.value.valor);
    const newValueWithId = {
      ...this.form.value,
      documentoMedico: this.documentoMedico,
      tipoDocumentoMedico: this.tipoDocumentoMedico,
      id: this.lastId
    };
    this.procedimientos.push(newValueWithId);
    this.items= this.procedimientos.length;
    this.sendProcedimientos.emit(this.procedimientos);
    this.sendSubtotal.emit(this.totalValue);
  }

  onRemove(id:number): void {
    this.submitted = false;
    let tmp = this.procedimientos.filter(procedimiento => procedimiento.id === id)
    this.procedimientos = this.procedimientos.filter(procedimiento => procedimiento.id !== id)
    this.items= this.procedimientos.length;
    this.sendProcedimientos.emit(this.procedimientos);
    this.totalValue -= Number(tmp[0].valor);
    this.sendSubtotal.emit(this.totalValue);
  }

  searchMD(): void {
    this.documentoMedico = "";
    this.tipoDocumentoMedico = "";

    const val = this.serviciosClinica.filter(servicio => servicio.codigo === this.form.value.tipoProcedimiento);
    this.documentoMedico = val[0].medico.documento;
    this.tipoDocumentoMedico = val[0].medico.tipoDocumento;
  }

}
