import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComplexComponent } from './components/card-complex/card-complex.component';
import { CardEventComponent } from './components/card-event/card-event.component';
import { CardPlaningComponent } from './components/card-planing/card-planing.component';


@NgModule({
    declarations: [
        CardComplexComponent,
        CardEventComponent,
        CardPlaningComponent
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        CardComplexComponent,
        CardEventComponent,
        CardPlaningComponent
    ]
})
export class MainModule {
}
