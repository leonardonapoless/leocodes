import Icon from '../components/ui/Icon';
import doomIcon from '../assets/games/Doom-1-icon.png';
import fileIcon from '../assets/ui/fileicon.svg';
import snakeIcon from '../assets/games/snake_icon.png';

interface GamesProps {
    onOpenDoom: () => void;
    onOpenManual: () => void;
    onOpenSnake?: () => void;
    isMobile?: boolean;
}

const Games = ({ onOpenDoom, onOpenManual, onOpenSnake, isMobile }: GamesProps) => {
    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: isMobile ? '120px' : '100%'
        }}>
            {isMobile ? (
                <Icon
                    iconSrc={snakeIcon}
                    label="Snake"
                    isSelected={false}
                    onSelect={() => onOpenSnake && onOpenSnake()}
                    onDoubleClick={() => onOpenSnake && onOpenSnake()}
                    onDrag={() => { }}
                    x={20}
                    y={20}
                    size={64}
                />
            ) : (
                <>
                    <Icon
                        iconSrc={doomIcon}
                        label="Doom"
                        isSelected={false}
                        onSelect={() => { }}
                        onDoubleClick={onOpenDoom}
                        onDrag={() => { }}
                        x={20}
                        y={20}
                        size={80}
                    />
                    <Icon
                        iconSrc={fileIcon}
                        label="Doom Read Me"
                        isSelected={false}
                        onSelect={() => { }}
                        onDoubleClick={onOpenManual}
                        onDrag={() => { }}
                        x={150}
                        y={20}
                        size={80}
                    />
                    <Icon
                        iconSrc={snakeIcon}
                        label="Snake"
                        isSelected={false}
                        onSelect={() => { }}
                        onDoubleClick={() => onOpenSnake && onOpenSnake()}
                        onDrag={() => { }}
                        x={280}
                        y={20}
                        size={80}
                    />
                </>
            )}
        </div>
    );
};

export default Games;
