import ComponentCard from "../../common/ComponentCard";
import Switch from "../switch/Switch";

export default function ToggleSwitch() {
  const handleSwitchChange = (checked) => {
    console.log("Switch is now:", checked ? "ON" : "OFF");
  };

  return (
    <ComponentCard title="Toggle switch input">
      {/* Primary Color Switches */}
      <div className="flex gap-4 mb-4">
        <Switch
          label="Default"
          defaultChecked={true}
          onChange={handleSwitchChange}
        />
        <Switch
          label="Checked"
          defaultChecked={true}
          onChange={handleSwitchChange}
        />
        <Switch label="Disabled" disabled={true} />
      </div>

      {/* Gray Color Switches */}
      <div className="flex gap-4">
        <Switch
          label="Default"
          defaultChecked={true}
          onChange={handleSwitchChange}
          color="gray"
        />
        <Switch
          label="Checked"
          defaultChecked={true}
          onChange={handleSwitchChange}
          color="gray"
        />
        <Switch label="Disabled" disabled={true} color="gray" />
      </div>
    </ComponentCard>
  );
}