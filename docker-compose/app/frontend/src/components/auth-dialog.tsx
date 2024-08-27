import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "@/lib/axios";


export default function AuthDialog() {

  const signUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fullName = (e.currentTarget.elements[0] as HTMLInputElement).value;
    const email = (e.currentTarget.elements[1] as HTMLInputElement).value;
    const password = (e.currentTarget.elements[2] as HTMLInputElement).value;
    const resp = axios.post("/auth/signup", {
      fullName,
      email,
      password,
    });
    console.log(resp);
  };

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.currentTarget.elements[0] as HTMLInputElement).value;
    const password = (e.currentTarget.elements[1] as HTMLInputElement).value;
    const resp = await axios.post("/auth/login", {
      email,
      password,
    });
    console.log(resp);
    if (resp.data.token)
      sessionStorage.setItem("token", resp.data.token);
    if (resp.data.user)
      localStorage.setItem("user", JSON.stringify(resp.data.user));
    window.location.reload();
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button>
          Auth
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Signup or Signin</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="signin" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">Sign-up</TabsTrigger>
            <TabsTrigger value="signin">Signin</TabsTrigger>
          </TabsList>
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Sign-up</CardTitle>
                <CardDescription>Create an account here.</CardDescription>
              </CardHeader>
              <form onSubmit={signUp}>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="name" placeholder="user user" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@gmail.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="******" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Create Account</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Signin</CardTitle>
                <CardDescription>Signin to your account here.</CardDescription>
              </CardHeader>
              <form onSubmit={login}>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="user@gmail.com" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="******" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">login</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
