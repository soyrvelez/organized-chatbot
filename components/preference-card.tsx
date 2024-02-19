import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


interface Preference {
  title: string;
  preferredModel: string;
  temperature: number;
  active: boolean;
}

interface PreferenceCardProps {
  preference: Preference;
}

export function PreferenceCard({ preference }: PreferenceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{preference.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={preference.preferredModel} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Available Models</SelectLabel>
              <SelectItem value="gpt-3.5-turbo">GPT 3.5 Turbo</SelectItem>
              <SelectItem value="davinci-002	">Davinci 002</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input type="number" id="temperature" placeholder={preference.temperature.toString()} />
      </CardContent>
    </Card>
  )
}
