
import React from "react";
import { Building2, Home, Store, Map, Warehouse } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyType {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const propertyTypes: PropertyType[] = [
  { id: "apartment", name: "Apartamento", icon: <Building2 className="h-6 w-6" /> },
  { id: "house", name: "Casa", icon: <Home className="h-6 w-6" /> },
  { id: "commercial", name: "Comercial", icon: <Store className="h-6 w-6" /> },
  { id: "land", name: "Terreno", icon: <Map className="h-6 w-6" /> },
  { id: "rural", name: "Rural", icon: <Warehouse className="h-6 w-6" /> },
];

interface PropertyTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PropertyTypeSelector({ value, onChange }: PropertyTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {propertyTypes.map((type) => (
        <div
          key={type.id}
          className={cn(
            "flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all",
            value === type.id
              ? "border-primary bg-primary/10 text-primary"
              : "border-muted bg-background hover:bg-muted/20"
          )}
          onClick={() => onChange(type.id)}
        >
          {type.icon}
          <span className="mt-2 text-sm font-medium">{type.name}</span>
        </div>
      ))}
    </div>
  );
}
