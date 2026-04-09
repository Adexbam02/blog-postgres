import localFont from 'next/font/local'
import { Geologica } from "next/font/google";

const geologica = Geologica(
    { subsets: ["latin"] }
    
);

const georgia = localFont({
  src: './georgia.ttf',
//   display: 'swap', // Optional: controls font-display
//   variable: '--font-my-font' // Optional: for use with CSS variables
});

export { geologica, georgia };
