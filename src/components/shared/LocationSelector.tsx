"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { locationService, Province, District, Ward } from "@/services/external/location";
import { Loader2 } from "lucide-react";

interface LocationValue {
    province: string;
    city: string; // This maps to "District"
    ward: string;
    address: string;
}

interface LocationSelectorProps {
    value: LocationValue;
    onChange: (value: LocationValue) => void;
    showAddress?: boolean;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    layout?: "vertical" | "horizontal";
}

export function LocationSelector({
    value,
    onChange,
    showAddress = true,
    required = false,
    disabled = false,
    className = "",
    layout = "vertical",
}: LocationSelectorProps) {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);

    const [loading, setLoading] = useState({
        provinces: false,
        districts: false,
        wards: false,
        init: false
    });

    // Internal state for selected codes (since parent only stores names)
    const [codes, setCodes] = useState<{
        province?: number;
        district?: number;
        ward?: number;
    }>({});

    // 1. Initial Load: Fetch Provinces
    useEffect(() => {
        const fetchProvinces = async () => {
            setLoading(prev => ({ ...prev, provinces: true }));
            const data = await locationService.getProvinces();
            setProvinces(data);
            setLoading(prev => ({ ...prev, provinces: false }));
        };
        fetchProvinces();
    }, []);

    // 2. Sync incoming "Names" to "Codes" (For Edit Mode)
    useEffect(() => {
        const syncCodes = async () => {
            // Only sync if we have names but no codes (initial load in edit mode)
            if (value.province && !codes.province && !loading.init) {
                setLoading(prev => ({ ...prev, init: true }));
                const foundCodes = await locationService.findCodesByName(
                    value.province,
                    value.city,
                    value.ward
                );

                if (foundCodes) {
                    setCodes({
                        province: foundCodes.provinceCode,
                        district: foundCodes.districtCode,
                        ward: foundCodes.wardCode
                    });

                    // Pre-fetch dependent lists
                    if (foundCodes.provinceCode) {
                        const dList = await locationService.getDistricts(foundCodes.provinceCode);
                        setDistricts(dList);
                        
                        if (foundCodes.districtCode) {
                            const wList = await locationService.getWards(foundCodes.districtCode);
                            setWards(wList);
                        }
                    }
                }
                setLoading(prev => ({ ...prev, init: false }));
            }
        };

        syncCodes();
    }, [value.province, value.city, value.ward]);

    // Handlers
    const handleProvinceChange = async (provinceCodeStr: string) => {
        if (provinceCodeStr === "all") {
            setCodes({ province: undefined, district: undefined, ward: undefined });
            setDistricts([]);
            setWards([]);
            onChange({ ...value, province: "", city: "", ward: "" });
            return;
        }

        const provinceCode = Number(provinceCodeStr);
        const province = provinces.find(p => p.code === provinceCode);
        
        if (!province) return;

        // Update state
        setCodes({ province: provinceCode, district: undefined, ward: undefined });
        setDistricts([]);
        setWards([]);
        
        // Update parent
        onChange({
            ...value,
            province: province.name,
            city: "",
            ward: "",
        });

        // Fetch districts
        setLoading(prev => ({ ...prev, districts: true }));
        const data = await locationService.getDistricts(provinceCode);
        setDistricts(data);
        setLoading(prev => ({ ...prev, districts: false }));
    };

    const handleDistrictChange = async (districtCodeStr: string) => {
        if (districtCodeStr === "all") {
            setCodes(prev => ({ ...prev, district: undefined, ward: undefined }));
            setWards([]);
            onChange({ ...value, city: "", ward: "" });
            return;
        }

        const districtCode = Number(districtCodeStr);
        const district = districts.find(d => d.code === districtCode);
        
        if (!district) return;

        setCodes(prev => ({ ...prev, district: districtCode, ward: undefined }));
        setWards([]);

        onChange({
            ...value,
            city: district.name,
            ward: "",
        });

        setLoading(prev => ({ ...prev, wards: true }));
        const data = await locationService.getWards(districtCode);
        setWards(data);
        setLoading(prev => ({ ...prev, wards: false }));
    };

    const handleWardChange = (wardCodeStr: string) => {
        if (wardCodeStr === "all") {
            setCodes(prev => ({ ...prev, ward: undefined }));
            onChange({ ...value, ward: "" });
            return;
        }

        const wardCode = Number(wardCodeStr);
        const ward = wards.find(w => w.code === wardCode);
        
        if (!ward) return;

        setCodes(prev => ({ ...prev, ward: wardCode }));
        onChange({
            ...value,
            ward: ward.name,
        });
    };

    const handleAddressChange = (address: string) => {
        onChange({ ...value, address });
    };

    if (loading.init) {
        return <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading location data...
        </div>;
    }

    if (layout === "horizontal") {
        return (
            <div className={`flex flex-col lg:flex-row gap-2 ${className}`}>
                <Select
                    disabled={disabled || loading.provinces}
                    value={loading.provinces ? "" : (codes.province?.toString() || "all")}
                    onValueChange={handleProvinceChange}
                >
                    <SelectTrigger className="w-full lg:w-[180px]">
                        <SelectValue placeholder={loading.provinces ? "Loading..." : "Province/City"} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Provinces</SelectItem>
                        {provinces.map((p) => (
                            <SelectItem key={p.code} value={p.code.toString()}>
                                {p.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    disabled={disabled || !codes.province || loading.districts}
                    value={loading.districts ? "" : (codes.district?.toString() || "all")}
                    onValueChange={handleDistrictChange}
                >
                    <SelectTrigger className="w-full lg:w-[160px]">
                        <SelectValue placeholder={loading.districts ? "Loading..." : "District"} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Districts</SelectItem>
                        {districts.map((d) => (
                            <SelectItem key={d.code} value={d.code.toString()}>
                                {d.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    disabled={disabled || !codes.district || loading.wards}
                    value={loading.wards ? "" : (codes.ward?.toString() || "all")}
                    onValueChange={handleWardChange}
                >
                    <SelectTrigger className="w-full lg:w-[160px]">
                        <SelectValue placeholder={loading.wards ? "Loading..." : "Ward"} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Wards</SelectItem>
                        {wards.map((w) => (
                            <SelectItem key={w.code} value={w.code.toString()}>
                                {w.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {showAddress && (
                    <Input
                        placeholder="Street Address"
                        value={value.address}
                        onChange={(e) => handleAddressChange(e.target.value)}
                        disabled={disabled}
                        required={required}
                        className="w-full lg:w-[200px]"
                    />
                )}
            </div>
        );
    }

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Province */}
                <div className="space-y-2">
                    <Label>Province/City {required && "*"}</Label>
                    <Select
                        disabled={disabled || loading.provinces}
                        value={codes.province?.toString() || ""}
                        onValueChange={handleProvinceChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={loading.provinces ? "Loading..." : "Select Province"} />
                        </SelectTrigger>
                        <SelectContent>
                            {provinces.map((p) => (
                                <SelectItem key={p.code} value={p.code.toString()}>
                                    {p.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* District */}
                <div className="space-y-2">
                    <Label>District {required && "*"}</Label>
                    <Select
                        disabled={disabled || !codes.province || loading.districts}
                        value={codes.district?.toString() || ""}
                        onValueChange={handleDistrictChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={loading.districts ? "Loading..." : "Select District"} />
                        </SelectTrigger>
                        <SelectContent>
                            {districts.map((d) => (
                                <SelectItem key={d.code} value={d.code.toString()}>
                                    {d.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Ward */}
                <div className="space-y-2">
                    <Label>Ward</Label>
                    <Select
                        disabled={disabled || !codes.district || loading.wards}
                        value={codes.ward?.toString() || ""}
                        onValueChange={handleWardChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={loading.wards ? "Loading..." : "Select Ward"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Wards</SelectItem>
                            {wards.map((w) => (
                                <SelectItem key={w.code} value={w.code.toString()}>
                                    {w.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Specific Address */}
                {showAddress && (
                    <div className="space-y-2">
                        <Label htmlFor="address">Street Address {required && "*"}</Label>
                        <Input
                            id="address"
                            placeholder="e.g., 123 Nguyen Van Linh"
                            value={value.address}
                            onChange={(e) => handleAddressChange(e.target.value)}
                            disabled={disabled}
                            required={required}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
