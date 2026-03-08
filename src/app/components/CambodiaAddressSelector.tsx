import { useState, useEffect } from "react";
import cambodiaData from "../../data/cambodia-addresses.json";

export interface Province {
  code: string;
  khmer: string;
  english: string;
  districts: District[];
}

export interface District {
  code: string;
  khmer: string;
  english: string;
  type: 'srok' | 'khan'; // ស្រុក (district) or ខណ្ឌ (municipal district)
  communes: Commune[];
}

export interface Commune {
  code: string;
  khmer: string;
  english: string;
  type: 'kommun' | 'sangkat'; // ឃុំ (commune) or សង្កាត់ (ward)
  villages: Village[];
}

export interface Village {
  code: string;
  khmer: string;
  english: string;
}

// Type for the imported JSON data
interface CambodiaData {
  provinces: Province[];
}

// Cast imported data to proper type
const data = cambodiaData as CambodiaData;
export const cambodiaProvinces: Province[] = data.provinces;

// Component Props
interface CambodiaAddressSelectorProps {
  onAddressSelect: (address: {
    province: string;
    district: string;
    commune: string;
    village: string;
  }) => void;
}

// Main Component
export function CambodiaAddressSelector({ onAddressSelect }: CambodiaAddressSelectorProps) {
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedCommune, setSelectedCommune] = useState<string>("");
  const [selectedVillage, setSelectedVillage] = useState<string>("");

  const [availableDistricts, setAvailableDistricts] = useState<District[]>([]);
  const [availableCommunes, setAvailableCommunes] = useState<Commune[]>([]);
  const [availableVillages, setAvailableVillages] = useState<Village[]>([]);

  // Handle Province Change
  useEffect(() => {
    if (selectedProvince) {
      const province = cambodiaProvinces.find(p => p.code === selectedProvince);
      setAvailableDistricts(province?.districts || []);
      setAvailableCommunes([]);
      setAvailableVillages([]);
      setSelectedDistrict("");
      setSelectedCommune("");
      setSelectedVillage("");
    } else {
      setAvailableDistricts([]);
      setAvailableCommunes([]);
      setAvailableVillages([]);
      setSelectedDistrict("");
      setSelectedCommune("");
      setSelectedVillage("");
    }
  }, [selectedProvince]);

  // Handle District Change
  useEffect(() => {
    if (selectedDistrict) {
      const district = availableDistricts.find(d => d.code === selectedDistrict);
      setAvailableCommunes(district?.communes || []);
      setAvailableVillages([]);
      setSelectedCommune("");
      setSelectedVillage("");
    } else {
      setAvailableCommunes([]);
      setAvailableVillages([]);
      setSelectedCommune("");
      setSelectedVillage("");
    }
  }, [selectedDistrict, availableDistricts]);

  // Handle Commune Change
  useEffect(() => {
    if (selectedCommune) {
      const commune = availableCommunes.find(c => c.code === selectedCommune);
      setAvailableVillages(commune?.villages || []);
      setSelectedVillage("");
    } else {
      setAvailableVillages([]);
      setSelectedVillage("");
    }
  }, [selectedCommune, availableCommunes]);

  // Handle Village Change and Notify Parent Component
  useEffect(() => {
    if (selectedVillage && selectedCommune && selectedDistrict && selectedProvince) {
      const province = cambodiaProvinces.find(p => p.code === selectedProvince);
      const district = availableDistricts.find(d => d.code === selectedDistrict);
      const commune = availableCommunes.find(c => c.code === selectedCommune);
      const village = availableVillages.find(v => v.code === selectedVillage);

      // Send individual address components to parent
      onAddressSelect({
        province: province?.khmer || "",
        district: district?.khmer || "",
        commune: commune?.khmer || "",
        village: village?.khmer || ""
      });
    }
  }, [selectedVillage, selectedCommune, selectedDistrict, selectedProvince, availableDistricts, availableCommunes, availableVillages, onAddressSelect]);

  return (
    <div className="space-y-4">
      {/* Province Selector */}
      <div>
        <label className="block text-white/60 text-xs mb-2">
          ខេត្ត/ក្រុង (Province/City) *
        </label>
        <select
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
          className="w-full bg-white/5 border border-white/20 text-white px-4 py-2 focus:outline-none focus:border-red-500 transition-colors"
          required
        >
          <option value="">-- ជ្រើសរើសខេត្ត/ក្រុង (Select Province/City) --</option>
          {cambodiaProvinces.map((province) => (
            <option key={province.code} value={province.code}>
              {province.khmer} - {province.english}
            </option>
          ))}
        </select>
      </div>

      {/* District Selector */}
      <div>
        <label className="block text-white/60 text-xs mb-2">
          {selectedProvince && availableDistricts.length > 0 
            ? (availableDistricts[0]?.type === 'khan' ? 'ខណ្ឌ (Khan/District) *' : 'ស្រុក (Srok/District) *') 
            : 'ស្រុក/ខណ្ឌ (District/Municipality) *'}
        </label>
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="w-full bg-white/5 border border-white/20 text-white px-4 py-2 focus:outline-none focus:border-red-500 transition-colors"
          disabled={!selectedProvince}
          required
        >
          <option value="">-- ជ្រើសរើសស្រុក/ខណ្ឌ (Select District/Municipality) --</option>
          {availableDistricts.map((district) => (
            <option key={district.code} value={district.code}>
              {district.khmer} - {district.english}
            </option>
          ))}
        </select>
      </div>

      {/* Commune Selector */}
      <div>
        <label className="block text-white/60 text-xs mb-2">
          {selectedDistrict && availableCommunes.length > 0 
            ? (availableCommunes[0]?.type === 'sangkat' ? 'សង្កាត់ (Sangkat/Ward) *' : 'ឃុំ (Khum/Commune) *') 
            : 'ឃុំ/សង្កាត់ (Commune/Ward) *'}
        </label>
        <select
          value={selectedCommune}
          onChange={(e) => setSelectedCommune(e.target.value)}
          className="w-full bg-white/5 border border-white/20 text-white px-4 py-2 focus:outline-none focus:border-red-500 transition-colors"
          disabled={!selectedDistrict}
          required
        >
          <option value="">-- ជ្រើសរើសឃុំ/សង្កាត់ (Select Commune/Ward) --</option>
          {availableCommunes.map((commune) => (
            <option key={commune.code} value={commune.code}>
              {commune.khmer} - {commune.english}
            </option>
          ))}
        </select>
      </div>

      {/* Village Selector */}
      <div>
        <label className="block text-white/60 text-xs mb-2">
          ភូមិ (Village) *
        </label>
        <select
          value={selectedVillage}
          onChange={(e) => setSelectedVillage(e.target.value)}
          className="w-full bg-white/5 border border-white/20 text-white px-4 py-2 focus:outline-none focus:border-red-500 transition-colors"
          disabled={!selectedCommune}
          required
        >
          <option value="">-- ជ្រើសរើសភូមិ (Select Village) --</option>
          {availableVillages.map((village) => (
            <option key={village.code} value={village.code}>
              {village.khmer} - {village.english}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
