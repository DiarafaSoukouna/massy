import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../dashboard/dashboard.component";
import { UserProfileComponent } from "../../user-profile/user-profile.component";
import { TableListComponent } from "../../table-list/table-list.component";
import { TypographyComponent } from "../../task/typographycomponent";
import { IconsComponent } from "../../icons/icons.component";
import { MapsComponent } from "../../maps/maps.component";
import { NotificationsComponent } from "../../notifications/notifications.component";
import { UpgradeComponent } from "../../upgrade/upgrade.component";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { LoginComponent } from "app/login/login.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { DataService } from "app/data.service";
import { MatIconModule } from "@angular/material/icon";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmationComponent } from "app/confirmation/confirmation.component";
import { AuthentificationService } from "app/authentification.service";
import { MatMenuModule } from "@angular/material/menu";
import { MembresComponent } from "app/membres/membres.component";
import { ProfileComponent } from "app/profile/profile.component";
import { ComponentsModule } from "app/components/components.module";
import { TaskDetailsComponent } from "app/task-details/task-details.component";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MessageComponent } from "app/message/message.component";
import { ProjectDetailsComponent } from "app/project-details/project-details.component";
import { ResetPasswordComponent } from "app/reset-password/reset-password.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatTableModule,
    DragDropModule,
    MatIconModule,
    NgbModule,
    MatMenuModule,
    ComponentsModule,
    MatListModule,
    MatSidenavModule,
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    LoginComponent,
    ConfirmationComponent,
    MembresComponent,
    ProfileComponent,
    TaskDetailsComponent,
    MessageComponent,
    ProjectDetailsComponent,
    ResetPasswordComponent,
  ],
  providers: [DataService, AuthentificationService],
})
export class AdminLayoutModule {}
