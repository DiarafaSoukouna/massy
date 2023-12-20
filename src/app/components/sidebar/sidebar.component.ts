import { Component, OnInit } from "@angular/core";

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: "/dashboard", title: "Dashboard", icon: "dashboard", class: "" },
  { path: "/user-profile", title: "Utilisateurs", icon: "person", class: "" },
  {
    path: "/table-list",
    title: "Projets",
    icon: "content_paste",
    class: "",
  },
  { path: "/typography", title: "Taches", icon: "library_books", class: "" },
  { path: "/icons", title: "Icons", icon: "location_on", class: "" },
  {
    path: "/maps",
    title: "Gestion des permissions",
    icon: "bubble_chart",
    class: "",
  },
  {
    path: "/notifications",
    title: "Notifications",
    icon: "notifications",
    class: "",
  },
  {
    path: "/upgrade",
    title: "Upgrade to PRO",
    icon: "unarchive",
    class: "active-pro",
  },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() {}

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
}
