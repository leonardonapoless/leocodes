import React from 'react';
import trebleMakerImage from '../assets/treblemaker_demo.png';

export interface Project {
    name: string;
    technologies: string[];
    description: string | React.ReactNode;
    githubLink: string;
    demoLink: string;
    videoSize?: { width: number; height: number };
    videoPosition?: { x: number; y: number };
    demoImage?: string;
}

export interface ProjectCategory {
    label: string;
    openByDefault: boolean;
    projects: Project[];
}

const iosProjects: Project[] = [
    {
        name: 'PAMS (Platform Agnostic Music Search)',
        technologies: ['Swift', 'SwiftUI'],
        description: 'A fast, no-frills way to search a song and open it on Apple Music, Spotify, TIDAL, or YouTube. Flip the artwork to see the nerdy bits, then get back to the music.',
        githubLink: 'https://github.com/leonardonapoless/PAMS',
        demoLink: 'https://youtu.be/d1w29lK44IM',
        videoSize: { width: 1020, height: 700 },
        videoPosition: { x: 100, y: 50 }
    },
    {
        name: 'TicTak',
        technologies: ['Swift', 'SwiftUI'],
        description: <>A simple tictactoe iOS app made in <i><b>Swift</b></i> and <i><b>SwiftUI</b></i> using the <i><b>MVVM</b></i> architecture.</>,
        githubLink: 'https://github.com/leonardonapoless/tictak',
        demoLink: 'https://youtube.com/shorts/sFOXO_k8Tg8?si=RTLpRh8eiyk4DQ09',
        videoSize: { width: 550, height: 700 },
        videoPosition: { x: 500, y: 50 }
    },
];

const macosProjects: Project[] = [
    {
        name: 'SNAG',
        technologies: ['Swift', 'SwiftUI'],
        description: 'A macOS app for downloading multiple GitHub repositories from a user profile at once.',
        githubLink: 'https://github.com/leonardonapoless/SNAG',
        demoLink: 'https://youtu.be/PAB1vdO5bq0',
        videoSize: { width: 1020, height: 700 },
        videoPosition: { x: 100, y: 50 }
    },
    {
        name: 'AutomataStudio',
        technologies: ['Swift', 'SwiftUI'],
        description: <>A native macOS app for designing and simulating finite automata, built with <i><b>SwiftUI</b></i>.</>,
        githubLink: 'https://github.com/leonardonapoless/AutomataStudio',
        demoLink: '',
    },
    {
        name: 'Blobber',
        technologies: ['Swift', 'Metal'],
        description: <>A simple <i><b>Metal</b></i> blob shader made for my Computer Graphics studies. It uses metaballs for a liquid effect, push it with the cursor or hit Space to interact with it and change its shape.</>,
        githubLink: 'https://github.com/leonardonapoless/Blobber',
        demoLink: '',
    }
];

const otherProjects: Project[] = [
    {
        name: 'TrebleMaker',
        technologies: ['C++', 'JUCE'],
        description: <>A simple high-shelf filter plugin built with <i><b>JUCE</b></i> and <i><b>C++</b></i>.</>,
        githubLink: 'https://github.com/leonardonapoless/treblemaker',
        demoLink: '',
        demoImage: trebleMakerImage
    },
    {
        name: 'Relikd',
        technologies: ['JavaFX', 'SQLite'],
        description: <>A vintage computer catalog application built with <i><b>JavaFX</b></i> and <i><b>SQLite</b></i> to browse classic hardware, featuring search and async image caching.</>,
        githubLink: 'https://github.com/leonardonapoless/Relikd',
        demoLink: ''
    },
    {
        name: 'Sacolão Rodrigues',
        technologies: ['HTML', 'CSS', 'JavaScript'],
        description: 'Sacolão Rodrigues (Trabalho Final de Introdução ao Desenvolvimento Web, 1º Período)',
        githubLink: 'https://github.com/leonardonapoless/SacolaoRodrigues',
        demoLink: 'https://sacolaorodrigues.kinsta.page/'
    },
    {
        name: 'Calc U Later',
        technologies: ['Java'],
        description: <>Simple Calculator App in <i><b>Java</b></i></>,
        githubLink: 'https://github.com/leonardonapoless/calc_u_later',
        demoLink: ''
    }
    // {
    //     name: 'LeoCodes - Portfolio',
    //     technologies: ['HTML', 'CSS', 'TypeScript', 'React', 'Vite'],
    //     description: <>My personal Classic Mac OS style portfolio website built with <i><b>React</b></i> and <i><b>Vite</b></i>.</>,
    //     githubLink: 'https://github.com/leonardonapoless/leocodes',
    //     demoLink: 'https://leocodes.vercel.app'
    // }
];

export const projectCategories: ProjectCategory[] = [
    { label: 'iOS Projects', openByDefault: true, projects: iosProjects },
    { label: 'macOS Projects', openByDefault: true, projects: macosProjects },
    { label: 'Other Projects', openByDefault: false, projects: otherProjects },
];
