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
  });
  submitted = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      numFactura: ['', [Validators.required]],
      fecFactura: ['', [Validators.required]],
      valFactura: ['', [Validators.required]],
      codEntidad: ['', [Validators.required]],
      nomEntidad: ['', [Validators.required]],
      numContrato: ['', [Validators.required]],
      planBeneficios: ['', [Validators.required]],
      numPoliza: ['', [Validators.required]],
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

    console.log(JSON.stringify(this.form.value, null, 2));
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
}
