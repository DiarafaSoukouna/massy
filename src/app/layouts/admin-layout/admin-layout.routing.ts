import { Routes } from "@angular/router";

import { DashboardComponent } from "../../dashboard/dashboard.component";
import { UserProfileComponent } from "../../user-profile/user-profile.component";
import { TableListComponent } from "../../table-list/table-list.component";
import { TypographyComponent } from "../../task/typographycomponent";
import { IconsComponent } from "../../icons/icons.component";
import { MapsComponent } from "../../maps/maps.component";
import { NotificationsComponent } from "../../notifications/notifications.component";
import { UpgradeComponent } from "../../upgrade/upgrade.component";
import { LoginComponent } from "app/login/login.component";
import { ConfirmationComponent } from "app/confirmation/confirmation.component";
import { MembresComponent } from "app/membres/membres.component";
import { ProfileComponent } from "app/profile/profile.component";
import { TaskDetailsComponent } from "app/task-details/task-details.component";
import { ProjectDetailsComponent } from "app/project-details/project-details.component";
import { ResetPasswordComponent } from "app/reset-password/reset-password.component";
import { OneTaskComponent } from "app/one-task/one-task.component";

export const AdminLayoutRoutes: Routes = [
  // {
  //   path: '',
  //   children: [ {
  //     path: 'dashboard',
  //     component: DashboardComponent
  // }]}, {
  // path: '',
  // children: [ {
  //   path: 'userprofile',
  //   component: UserProfileComponent
  // }]
  // }, {
  //   path: '',
  //   children: [ {
  //     path: 'icons',
  //     component: IconsComponent
  //     }]
  // }, {
  //     path: '',
  //     children: [ {
  //         path: 'notifications',
  //         component: NotificationsComponent
  //     }]
  // }, {
  //     path: '',
  //     children: [ {
  //         path: 'maps',
  //         component: MapsComponent
  //     }]
  // }, {
  //     path: '',
  //     children: [ {
  //         path: 'typography',
  //         component: TypographyComponent
  //     }]
  // }, {
  //     path: '',
  //     children: [ {
  //         path: 'upgrade',
  //         component: UpgradeComponent
  //     }]
  // }
  { path: "dashboard", component: DashboardComponent },
  { path: "user-profile", component: UserProfileComponent },
  { path: "table-list", component: TableListComponent },
  { path: "task", component: TypographyComponent },
  { path: "maps", component: MapsComponent },
  { path: "notifications", component: NotificationsComponent },
  { path: "upgrade", component: UpgradeComponent },
  { path: "login", component: LoginComponent },
  { path: "confirmation", component: ConfirmationComponent },
  { path: "membres", component: MembresComponent },
  { path: "chat", component: IconsComponent },
  { path: "profile", component: ProfileComponent },
  { path: "task-details", component: TaskDetailsComponent },
  { path: "project-details", component: ProjectDetailsComponent },
  { path: "reset-password", component: ResetPasswordComponent },
  { path: "one-task", component: OneTaskComponent },
];
