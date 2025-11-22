import swiftIcon from '../assets/swift.svg';
import javaIcon from '../assets/java.svg';
import javascriptIcon from '../assets/javascript.svg';
import htmlIcon from '../assets/html.svg';
import cssIcon from '../assets/css.svg';
import reactIcon from '../assets/react.svg';
import viteIcon from '../assets/Vite.js.svg';

const Projects = ({ onOpenVideo, onOpenBrowser }) => {
    const iosProjects = [
        {
            id: 1, name: 'PAMS (Platform Agnostic Music Search)',
            technologies: ['Swift'],
            description: 'A fast, no-frills way to search a song and open it on Apple Music, Spotify, TIDAL, or YouTube. Flip the artwork to see the nerdy bits, then get back to the music.',
            githubLink: 'https://github.com/leonardonapoless/PAMS',
            demoLink: ''
        },
        {
            id: 2, name: 'TicTak',
            technologies: ['Swift'],
            description: 'A simple tictactoe iOS app made in Swift and SwiftUI using the MVVM architecture.',
            githubLink: 'https://github.com/leonardonapoless/tictak',
            demoLink: 'https://youtube.com/shorts/sFOXO_k8Tg8?si=RTLpRh8eiyk4DQ09'
        },
    ];

    const otherProjects = [
        {
            id: 3, name: 'Sacolão Rodrigues',
            technologies: ['HTML', 'CSS', 'JavaScript'],
            description: 'Sacolão Rodrigues (Trabalho Final de Introdução ao Desenvolvimento Web, 1º Período)',
            githubLink: 'https://github.com/leonardonapoless/SacolaoRodrigues',
            demoLink: 'https://sacolaorodrigues.kinsta.page/'
        },
        {
            id: 4, name: 'Calc U Later',
            technologies: ['Java'],
            description: 'Simple Calculator App in Java',
            githubLink: 'https://github.com/leonardonapoless/calc_u_later',
            demoLink: ''
        },
        {
            id: 5, name: 'LeoCodes - Portfolio',
            technologies: ['HTML', 'CSS', 'JavaScript', 'React', 'Vite'],
            description: 'My personal Classic Mac OS style portfolio website built with React and Vite.',
            githubLink: 'https://github.com/leonardonapoless/leocodes',
            demoLink: 'https://leocodes.vercel.app'
        }
    ];

    const extractYouTubeVideoId = (url) => {
        const patterns = [
            { match: 'youtube.com/shorts/', extract: (u) => u.split('shorts/')[1].split('?')[0] },
            { match: 'v=', extract: (u) => u.split('v=')[1].split('&')[0] },
            { match: 'youtu.be/', extract: (u) => u.split('youtu.be/')[1].split('?')[0] },
            { match: 'youtube.com/embed/', extract: (u) => u.split('embed/')[1].split('?')[0] }
        ];

        for (const pattern of patterns) {
            if (url.includes(pattern.match)) {
                return pattern.extract(url);
            }
        }
        return '';
    };

    const handleDemoClick = (e, project) => {
        const isYouTubeLink = project.demoLink.includes('youtube.com') || project.demoLink.includes('youtu.be');

        if (isYouTubeLink) {
            e.preventDefault();
            const videoId = extractYouTubeVideoId(project.demoLink);

            if (videoId && onOpenVideo) {
                onOpenVideo(videoId, project.name);
            } else {
                window.open(project.demoLink, '_blank');
            }
        } else {
            // for non-video links, try to open in internal browser
            if (onOpenBrowser) {
                e.preventDefault();
                onOpenBrowser(project.demoLink, project.name);
            }
            // if no handler provided, let default anchor behavior happen (open in new tab)
        }
    };

    const getTechnologyIcon = (techName) => {
        const iconMap = {
            'Swift': swiftIcon,
            'SwiftUI': swiftIcon,
            'MVVM': null,
            'Java': javaIcon,
            'Java Swing': javaIcon,
            'JavaScript': javascriptIcon,
            'HTML': htmlIcon,
            'CSS': cssIcon,
            'React': reactIcon,
            'Vite': viteIcon
        };
        return iconMap[techName] || null;
    };

    const renderProjectList = (projects, openByDefault = true) => (
        <ul className="tree-view">
            {projects.map(project => (
                <li key={project.id}>
                    <details open={openByDefault}>
                        <summary>
                            <b>
                                {project.name}
                                {project.technologies && (
                                    <span style={{ marginLeft: '4px', display: 'inline-block' }}>
                                        {' '}
                                        {project.technologies.map((tech, index) => {
                                            const icon = getTechnologyIcon(tech);
                                            let iconFilter = 'grayscale(100%) contrast(2) brightness(0.8)';

                                            if (tech === 'React') {
                                                iconFilter = 'brightness(0) saturate(100%)';
                                            }
                                            else if (tech === 'Swift' || tech === 'SwiftUI' || tech === 'Java') {
                                                iconFilter = 'none';
                                            }

                                            return icon ? (
                                                <img
                                                    key={index}
                                                    src={icon}
                                                    alt={tech}
                                                    title={tech}
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        verticalAlign: 'middle',
                                                        paddingBottom: '4px',
                                                        marginLeft: index === 0 ? '0' : '6px',
                                                        filter: iconFilter
                                                    }}
                                                />
                                            ) : (
                                                <span key={index} style={{ fontSize: '11px', color: '#555', marginLeft: '4px' }}>{tech}</span>
                                            );
                                        })}
                                    </span>
                                )}
                            </b>
                        </summary>
                        <ul>
                            <li>{project.description}</li>
                            <li><a href={project.githubLink} target="_blank" rel="noopener noreferrer">See Code</a></li>
                            {project.demoLink && <li><a href={project.demoLink} onClick={(e) => handleDemoClick(e, project)} target="_blank" rel="noopener noreferrer">See Demo</a></li>}
                        </ul>
                    </details>
                    <br />
                </li>
            ))}
        </ul>
    );

    return (
        <div>
            <fieldset>
                <legend>iOS Projects</legend>
                {renderProjectList(iosProjects)}
            </fieldset>

            <br />

            <fieldset>
                <legend>Other Projects</legend>
                {renderProjectList(otherProjects, false)}
            </fieldset>
        </div>
    );
};

export default Projects;
