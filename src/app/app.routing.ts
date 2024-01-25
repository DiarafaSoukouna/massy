import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { LoginComponent } from "./login/login.component";
import { ConfirmationComponent } from "./confirmation/confirmation.component";
import { ProfileComponent } from "./profile/profile.component";
import { IconsComponent } from "./icons/icons.component";
import { CanActivateService } from "./can-activate.service";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [CanActivateService],
  },
  {
    path: "confirmation",
    component: ConfirmationComponent,
  },
  {
    path: "reset-password",
    component: ResetPasswordComponent,
    canActivate: [CanActivateService],
  },
  {
    path: "chat",
    component: IconsComponent,
    canActivate: [CanActivateService],
  },
  {
    path: "",
    component: AdminLayoutComponent,
    canActivate: [CanActivateService],
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./layouts/admin-layout/admin-layout.module").then(
            (m) => m.AdminLayoutModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  providers: [CanActivateService],
  exports: [],
})
export class AppRoutingModule {}
