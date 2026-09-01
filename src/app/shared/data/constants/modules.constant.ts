export interface Submodule {
  name: string;
  value: string;
  route: string;
}

export interface Module {
  name: string;
  value: string;
  /** Ícono de bootstrap-icons, sin el prefijo `bi-`. */
  icon: string;
  /** Sólo para módulos sin submódulos (navegan directo). */
  route?: string;
  submodules?: Submodule[];
}

export const MODULES: Module[] = [
  {
    name: 'Dashboard',
    value: 'dashboard',
    icon: 'grid-1x2',
    route: 'home',
  },
  {
    name: 'Medicamentos',
    value: 'meds',
    icon: 'capsule',
    submodules: [
      {
        name: 'Listado',
        value: 'meds_list',
        route: 'modules/meds/list',
      },
      {
        name: 'Tipos',
        value: 'meds_type',
        route: 'modules/meds/type/list',
      },
      {
        name: 'Formas',
        value: 'meds_form',
        route: 'modules/meds/form/list',
      },
      {
        name: 'Unidad de Medida',
        value: 'meds_measurement',
        route: 'modules/meds/measurement/list',
      },
      {
        name: 'Drogas',
        value: 'meds_drug',
        route: 'modules/meds/drug/list',
      },
    ],
  },
  {
    name: 'Profesionales',
    value: 'professionals',
    icon: 'person-badge',
    submodules: [
      {
        name: 'Listado',
        value: 'professionals_list',
        route: 'modules/professionals/list',
      },
      {
        name: 'Especializaciones',
        value: 'professionals_specializations',
        route: 'modules/professionals/specializations/list',
      },
    ],
  },
  {
    name: 'Usuarios',
    value: 'users',
    icon: 'people',
    submodules: [
      {
        name: 'Listado',
        value: 'users_list',
        route: 'modules/users/list',
      },
    ],
  },
];
