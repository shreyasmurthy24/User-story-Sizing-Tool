import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from './login/user-login/user-login.component';
import { SizingBoardComponent } from './dashboard/sizing-board/sizing-board.component';

const routes: Routes = [
  { path: '', component: UserLoginComponent },
  { path: 'sizing-board', component: SizingBoardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), UserLoginComponent],
  exports: [RouterModule]
})
export class AppRoutingModule { }
