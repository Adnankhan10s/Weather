"use client"
import { Card , CardContent,CardHeader ,CardTitle , CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CloudIcon , MapPinIcon, ThermometerIcon } from "lucide-react";
import { FormEvent, useState } from "react";


interface WeatherData {
 temprature:number,
 description:string,
 location:string,
 unit:string
}


const Weather_widget = () => {

const [location, setLocation] = useState<string>("");
const [weather, setWeather] = useState <WeatherData | null>(null);
const [error, setError] = useState<string |null>(null);
const [isloading, setIsloading] = useState<boolean>(false);

const handleData = async(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const trimedLocation = location.trim();
    if (!trimedLocation) {
        setError("Please Enter A Valid Location");
        setIsloading(false);
        return;
    }
    setIsloading(true);
    setError(null);
    try {
        const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API}&q=${trimedLocation}`);
        if (!res.ok) {
            throw new Error("City Not Found");
        }
        const data = await res.json();
        console.log(data)
        const Weather:WeatherData ={
            temprature:data.current.temp_c,
            description:data.current.condition.text,
            location:data.location.name,
            unit:"C",
        }
    setWeather(Weather);

    } catch (error) {
        setError(`City Not Found Please Try Again ${error}`);
        setWeather(null);
    }finally{
      setIsloading(false);
    }

};
function temprature (temprature:number , unit:string):string{
   if (unit == "C") {
       if (temprature < 0) {
           return `it's Too Cold ${temprature}°C Freezing!`;
       }else if (temprature < 10) {
        return `it's Quit Cold ${temprature}°C Wear warm Clothes. `;
       }else if (temprature < 20) {
        return `Temprature is ${temprature}°C Good for Light jackets`;
       }else if (temprature <30) {
        return `Temprature is ${temprature}°C Enjoy a lovely weather`;
       }else{
        return `It's Too Hot ${temprature}°C Stay Hyderated !!!`;
       }
   }else{
    return `${temprature}°${unit}`;
   }
}
 
function description (description:string):string{
  switch (description.toLocaleLowerCase()) {
    case "sunny":
        return "It's Beautifull Sunny Day!";
    case "partly cloudy":
        return "Some Cloud's & Sun Shine";
    case "cloudy" :
        return "It's Lovely Cloudy Day";
    case "overcast":
        return "The Sky is OverCast .";
    case "rain":
        return "Don't Forget You'r Umbrella ! It's Raining.";
    case "thunderstorm":
        return "Thunderstorm are expected today !"  ;
    case "snow":
        return "It,s Snowing Day"   ;
    case "mist"   :
        return "It's misty outside"   ;
    case "fog":
        return "Be Carefull !! There's Fog Outside ." ;    
    default:
       return description;
  }
};
function locationMessage (location:string):string{
    const currentHours = new Date().getHours();
    const isNight = currentHours >=18 || currentHours < 6;
    return `${location} ${isNight ? "at Night" : "During The Day"}`;

};

  return (
   <div className="flex justify-center items-center h-screen">
    <Card className="w-full md:max-w-md max-w-sm mx-auto text-center">
        <CardHeader>
            <CardTitle>Weather Update</CardTitle>
            <CardDescription>Search for current Weather in your City</CardDescription>
        </CardHeader>
        <CardContent>
        <form onSubmit={handleData} className="flex items-center gap-2">
            <Input
            type="text"
            placeholder="Enter A City"
            value={location}
            onChange={(e)=>setLocation(e.target.value)} />
            <Button type="submit" disabled={isloading}>
                {isloading ? "Loading...":"Search"}
            </Button>
        </form>
        
    {error && <div className="mt-4 text-red-500">{error}</div>}
    {weather && (
        <div className="mt-4 grid gap-2">
           <div className="flex items-center gap-2">
            <ThermometerIcon className="w-6 h-6"/>
            {temprature(weather.temprature , weather.unit)}
           </div>
           <div className="flex items-center gap-2">
            <CloudIcon className="w-6 h-6"/>
            {description(weather.description)}
           </div>
           <div className="flex items-center gap-2">
            <MapPinIcon className="w-6 h-6"/>
            {locationMessage(weather.location)}
           </div>
           
        </div>
    )}

</CardContent>
    </Card>

   </div>
  )
}

export default Weather_widget



