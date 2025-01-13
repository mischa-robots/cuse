"use client";

import { Book, MenuIcon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { FaGithub } from "react-icons/fa";

const Navbar = () => {
  return (
    <section className="p-4">
      <div className="w-full">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo.svg" alt="logo" className="w-8 dark:invert" />
            <span className="text-3xl font-semibold">Cuse</span>
          </div>
          <NavigationMenu className="hidden md:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#features"
                  className={navigationMenuTriggerStyle()}
                >
                  Features
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#benefits"
                  className={navigationMenuTriggerStyle()}
                >
                  Benefits
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#community"
                  className={navigationMenuTriggerStyle()}
                >
                  Community
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#roadmap"
                  className={navigationMenuTriggerStyle()}
                >
                  Roadmap
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="hidden items-center gap-4 md:flex">
            <ThemeToggle />
            <Button variant="outline" asChild>
              <a href="https://docs.cuse.dev" target="_blank">
                <Book />
                Docs
              </a>
            </Button>
            <Button asChild>
              <a href="https://github.com/cuse-dev/cuse" target="_blank">
                <FaGithub className="mr-2" />
                Github
              </a>
            </Button>
          </div>
          <Sheet>
            <div className="flex items-center gap-4 md:hidden">
              <ThemeToggle />
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <MenuIcon className="h-4 w-4" />
                </Button>
              </SheetTrigger>
            </div>
            <SheetContent side="top" className="max-h-screen overflow-scroll">
              <SheetHeader>
                <SheetTitle>
                  <div className="flex items-center gap-4">
                    <img
                      src="https://shadcnblocks.com/images/block/block-1.svg"
                      alt="logo"
                      className="w-8 dark:invert"
                    />
                    <span className="text-lg font-bold">Shadcn Blocks</span>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col mt-8">
                <div className="flex flex-col gap-4">
                  <a href="#features" className="font-medium">
                    Features
                  </a>
                  <a href="#benefits" className="font-medium">
                    Benefits
                  </a>
                  <a href="#roadmap" className="font-medium">
                    Roadmap
                  </a>
                </div>
                <div className="mt-6 flex flex-col gap-4">
                  <Button variant="outline" asChild>
                    <a href="https://docs.cuse.dev" target="_blank">
                      <Book />
                      Documentation
                    </a>
                  </Button>
                  <Button asChild>
                    <a href="https://github.com/cuse-dev/cuse" target="_blank">
                      <FaGithub className="mr-2" />
                      Github
                    </a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </section>
  );
};

export default Navbar;
