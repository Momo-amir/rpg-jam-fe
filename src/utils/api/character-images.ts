import type { StaticImageData } from "next/image";

import bardImage from "@/public/assets/bard.png";
import fighterImage from "@/public/assets/fighter.png";
import wizardImage from "@/public/assets/wizard.png";
import humanImage from "@/public/assets/human.png";
import gnomeImage from "@/public/assets/gnome.png";
import soldierImage from "@/public/assets/soldier.png";
import sageImage from "@/public/assets/sage.png";

export const classImages: Record<string, StaticImageData> = {
  fighter: fighterImage,
  wizard: wizardImage,
  bard: bardImage,
};

export const speciesImages: Record<string, StaticImageData> = {
  "species-human": humanImage,
  "species-gnome": gnomeImage,
};

export const backgroundImages: Record<string, StaticImageData> = {
  soldier: soldierImage,
  sage: sageImage,
};
