import Icon from '../components/ui/Icon';
import doomIcon from '../assets/Doom-1-icon.png';
import fileIcon from '../assets/fileicon.svg';

const Games = ({ onOpenDoom, onOpenManual }) => {
    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '100%'
        }}>
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
        </div>
    );
};

export default Games;
