import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Palette, Type, RotateCcw, Settings } from "lucide-react";
import { useTheme, GOOGLE_FONTS } from "@/contexts/ThemeContext";

const BACKGROUND_PRESETS = [
  { name: "Light Gray", value: "from-slate-50 to-slate-100" },
  { name: "Pure White", value: "from-white to-white" },
  { name: "Warm White", value: "from-orange-50 to-red-50" },
  { name: "Cool Blue", value: "from-blue-50 to-indigo-50" },
  { name: "Soft Purple", value: "from-purple-50 to-pink-50" },
  { name: "Fresh Green", value: "from-green-50 to-emerald-50" },
  { name: "Dark Mode", value: "from-slate-900 to-slate-800" },
  { name: "Deep Blue", value: "from-blue-900 to-indigo-900" },
];

const COLOR_PRESETS = [
  { name: "Purple", value: "hsl(262, 80%, 50%)" },
  { name: "Blue", value: "hsl(221, 83%, 53%)" },
  { name: "Green", value: "hsl(142, 76%, 36%)" },
  { name: "Red", value: "hsl(0, 84%, 60%)" },
  { name: "Orange", value: "hsl(25, 95%, 53%)" },
  { name: "Pink", value: "hsl(336, 75%, 40%)" },
  { name: "Teal", value: "hsl(173, 58%, 39%)" },
  { name: "Indigo", value: "hsl(231, 48%, 48%)" },
];

export function ThemeSettings() {
  const { theme, updateTheme, resetTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleColorChange = (
    type: "primaryColor" | "secondaryColor",
    color: string,
  ) => {
    updateTheme({ [type]: color });
  };

  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          h = 0;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 shadow-lg bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-slate-100"
        style={{ fontFamily: '"Open Sans", sans-serif' }}
      >
        <Settings className="w-4 h-4 mr-2" />
        Theme Settings
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" style={{ fontFamily: '"Open Sans", sans-serif' }}>
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <Palette className="w-5 h-5" />
                Theme Settings
              </CardTitle>
              <CardDescription className="text-slate-300">
                Customize the appearance of your pricing page
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetTheme}
                className="border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600 hover:text-slate-100"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                size="sm"
                onClick={() => setIsOpen(false)}
                className="bg-primary hover:bg-primary/90"
              >
                Done
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="colors" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
              <TabsTrigger value="background">Background</TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">
                    Primary Color
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Used for buttons, links, and accents
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        className="w-8 h-8 rounded-lg border-2 border-white shadow-sm hover:scale-110 transition-transform"
                        style={{ backgroundColor: preset.value }}
                        onClick={() =>
                          handleColorChange("primaryColor", preset.value)
                        }
                        title={preset.name}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="color"
                      value={
                        theme.primaryColor.includes("hsl")
                          ? "#8b5cf6"
                          : theme.primaryColor
                      }
                      onChange={(e) =>
                        handleColorChange(
                          "primaryColor",
                          hexToHsl(e.target.value),
                        )
                      }
                      className="w-12 h-8 p-1 border-none"
                    />
                    <Badge variant="outline" className="text-xs">
                      {theme.primaryColor}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold">
                    Secondary Color
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Used for secondary elements and borders
                  </p>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="color"
                      value={
                        theme.secondaryColor.includes("hsl")
                          ? "#f1f5f9"
                          : theme.secondaryColor
                      }
                      onChange={(e) =>
                        handleColorChange(
                          "secondaryColor",
                          hexToHsl(e.target.value),
                        )
                      }
                      className="w-12 h-8 p-1 border-none"
                    />
                    <Badge variant="outline" className="text-xs">
                      {theme.secondaryColor}
                    </Badge>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="typography" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">Header Font</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Used for titles and headings
                  </p>
                  <Select
                    value={theme.headerFont}
                    onValueChange={(value) =>
                      updateTheme({ headerFont: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-48">
                      {GOOGLE_FONTS.map((font) => (
                        <SelectItem key={font} value={font}>
                          <span style={{ fontFamily: font }}>{font}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-semibold">Button Font</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Used for buttons and call-to-actions
                  </p>
                  <Select
                    value={theme.buttonFont}
                    onValueChange={(value) =>
                      updateTheme({ buttonFont: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-48">
                      {GOOGLE_FONTS.map((font) => (
                        <SelectItem key={font} value={font}>
                          <span style={{ fontFamily: font }}>{font}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-semibold">Text Font</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Used for body text and descriptions
                  </p>
                  <Select
                    value={theme.textFont}
                    onValueChange={(value) => updateTheme({ textFont: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-48">
                      {GOOGLE_FONTS.map((font) => (
                        <SelectItem key={font} value={font}>
                          <span style={{ fontFamily: font }}>{font}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="background" className="space-y-6">
              <div>
                <Label className="text-base font-semibold">
                  Background Style
                </Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Choose a background gradient for your pricing page
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {BACKGROUND_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      className={`p-4 rounded-lg border-2 text-left hover:scale-105 transition-transform ${
                        theme.backgroundColor === preset.value
                          ? "border-primary"
                          : "border-border"
                      }`}
                      onClick={() =>
                        updateTheme({ backgroundColor: preset.value })
                      }
                    >
                      <div
                        className={`w-full h-12 rounded bg-gradient-to-br ${preset.value} mb-2`}
                      />
                      <p className="font-medium text-sm">{preset.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
