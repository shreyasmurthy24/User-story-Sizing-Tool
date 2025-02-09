import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from './login/user-login/user-login.component';

const routes: Routes = [
  { path: '', component: UserLoginComponent },
  // { path: 'sizing-board', component: SizingBoardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), UserLoginComponent],
  exports: [RouterModule]
})
export class AppRoutingModule { }
