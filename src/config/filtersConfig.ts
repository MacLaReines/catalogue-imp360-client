export type FilterConfig = {
  label: string;
  type: 'range' | 'select' | 'checkbox';
  options?: string[];
  field: string; 
  source: 'product' | 'specs';
  matchType?: 'exact' | 'contains';
};

export const commonFilters: FilterConfig[] = [];

export const categoryFilters: Record<string, FilterConfig[]> = {
  "réseaux - nas": [
    {
      label: "Type",
      type: "checkbox",
      options: ["Routeur PFSENSE", "Borne WIFI", "SWITCH", "NAS", "KIT RAIL NAS", "HDD NAS RACK", "RESEAUX NAS RACK"],
      field: "type",
      source: "product"
    },
    {
      label: "Nombre de baies/ports",
      type: "checkbox",
      options: ["6 ou moins", "8", "16", "24", "48"],
      field: "racks",
      source: "specs"
    },
  ],
  "accessoires": [
    {
      label: "Type",
      type: "checkbox",
      options: [
        "Enregistreur  Numerique",
        "Accessoire Enregistreur  Numerique",
        "Lecteur  de carte Vital",
        "cartes de nettoyage",
        "Douchette",
        "SOURIS USB FILAIRE",
        "SOURIS USB SANS FIL",
        "CLAVIR USB  FILAIRE",
        "PACK CLAVIER& SOURIS  SANS FIL",
        "IMPRIMANTE THERMIQUE D' ETIQUETTE",
        "HUB  USB",
        "ANTIVOL LENOVO",
        "STATION d'accueil",
        "CHARGEUR",
        "Sacoche",
        "SO DIMM DDR5",
        "SERVICE",
        "WEBCAM",
        "SUPPORT UC + ECRAN",
        "LECTEUR  DVD EXTERNE",
        "PDU"
      ],
      field: "type",
      source: "product"
    },
    {
      label: "Type de connectique",
      type: "checkbox",
      options: [
        "USB Type A",
        "USB Type A-B",
        "USB-C vers USB-A",
        "RECEPTEUR   USB-A",
        "RECEPTEUR   USB-A BLUETOOTH",
        "USB Type A et C",
        "Adaptateur secteur 65W",
        "Adaptateur secteur 90W"
      ],
      field: "cable",
      source: "specs"
    }
  ],
  "écrans": [
    {
      label: "Marque",
      type: "checkbox",
      options: [
        "DELL",
        "ACER",
        "ASUS",
        "LG"
      ],
      field: "brand",
      source: "product"
    },
    {
      label: "Taille d'écran",
      type: "checkbox",
      options: [
        "21P",
        "22P",
        "24P",
        "27P",
        "31P",
        "32P",
        "55P"
      ],
      field: "displaySize",
      source: "specs"
    }
  ],
  "ordinateurs": [
    {
      label: "Marque",
      type: "checkbox",
      options: [
        "DELL",
        "LENOVO",
        "ASUS",
        "MSI"
      ],
      field: "brand",
      source: "product"
    },
    {
      label: "Type",
      type: "checkbox",
      options: [
        "WORKSTATION",
        "PC PORTABLE",
        "ALL IN ONE",
        "UC Bureautique"
      ],
      field: "type",
      source: "product",
      matchType: "contains"
    },
    {
      label: "Processeur",
      type: "checkbox",
      options: [
        "Intel Core i5",
        "Intel Core i7",
        "Intel Core i9",
        "Intel Core Ultra 7",
        "Intel Xeon 2423"
      ],
      field: "cpu",
      source: "specs"
    },
    {
      label: "Mémoire RAM",
      type: "checkbox",
      options: [
        "8 Go Sodimm DDR4",
        "16 Go Sodimm DDR4",
        "16 Go Sodimm DDR5",
        "16 Go (1 x 16 Go)  DDR5",
        "32 Go (2 x 16 Go)  DDR5",
        "32 Go soudée  Sodimm DDR5"
      ],
      field: "ram",
      source: "specs"
    }
  ]
};

export type NestedFilterOption = {
  label: string;
  options?: string[];
};

export const nestedFilters: Record<string, NestedFilterOption[]> = {};
