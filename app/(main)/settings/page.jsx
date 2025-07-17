"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const SettingsPage = () => {
  const defaultSettings = {
    appName: "My Application",
    theme: "light",
    apiUrl: "https://api.example.com",
    snippet: "",
  };

  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem("appSettings"));
    if (savedSettings) setSettings(savedSettings);
  }, []);

  useEffect(() => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const saveSettings = () => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="container min-h-screen mx-auto p-5 flex flex-col items-center">
      <Card className="max-w-2xl w-full p-6 shadow-lg border border-gray-300 bg-white">
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-bold text-center">
            Application Settings
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <Label>Application Name</Label>
            <Input
              name="appName"
              value={settings.appName}
              onChange={handleChange}
            />
            <Label>API URL</Label>
            <Input
              name="apiUrl"
              value={settings.apiUrl}
              onChange={handleChange}
            />
            <Label>Theme</Label>
            <select
              name="theme"
              value={settings.theme}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>

            {/* Date control */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="showDate"
                name="showDate"
                checked={!!settings.showDate}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    showDate: e.target.checked,
                  }))
                }
              />
              <Label htmlFor="showDate">Show Date</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button onClick={saveSettings}>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
