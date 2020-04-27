import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObservableFromConstructorPropertyComponent} from './observable-from-constructor-property/observable-from-constructor-property.component';
import {PROPERTY_COMPONENT, PropertyModule} from '../property';
import {SpecialModule} from '../property/special';
import {ObservableFromOperatorPropertyComponent} from './observable-from-operator-property/observable-from-operator-property.component';
import {ObservableFromSubscribePropertyComponent} from './observable-from-subscribe-property/observable-from-subscribe-property.component';
import {ConstructorDeclarationPropertyComponent} from './constructor-declaration-property/constructor-declaration-property.component';
import {OperatorDeclarationPropertyComponent} from './operator-declaration-property/operator-declaration-property.component';
import {SubscribeDeclarationPropertyComponent} from './subscribe-declaration-property/subscribe-declaration-property.component';
import {SourceFilePositionPropertyComponent} from './source-file-position-property/source-file-position-property.component';

const COMPONENTS = [
  ObservableFromConstructorPropertyComponent,
  ObservableFromOperatorPropertyComponent,
  ObservableFromSubscribePropertyComponent,
  ConstructorDeclarationPropertyComponent,
  OperatorDeclarationPropertyComponent,
  SubscribeDeclarationPropertyComponent,
  SourceFilePositionPropertyComponent,
];

@NgModule({
  declarations: COMPONENTS,
  entryComponents: COMPONENTS,
  imports: [
    CommonModule,
    SpecialModule,
    PropertyModule
  ]
})
export class ModelPropertyModule {
  static forRoot(): ModuleWithProviders<ModelPropertyModule> {
    return {
      ngModule: ModelPropertyModule,
      providers: [
        {provide: PROPERTY_COMPONENT, multi: true, useValue: ObservableFromConstructorPropertyComponent},
        {provide: PROPERTY_COMPONENT, multi: true, useValue: ObservableFromOperatorPropertyComponent},
        {provide: PROPERTY_COMPONENT, multi: true, useValue: ObservableFromSubscribePropertyComponent},
        {provide: PROPERTY_COMPONENT, multi: true, useValue: ConstructorDeclarationPropertyComponent},
        {provide: PROPERTY_COMPONENT, multi: true, useValue: OperatorDeclarationPropertyComponent},
        {provide: PROPERTY_COMPONENT, multi: true, useValue: SubscribeDeclarationPropertyComponent},
        {provide: PROPERTY_COMPONENT, multi: true, useValue: SourceFilePositionPropertyComponent},
      ],
    };
  }
}
