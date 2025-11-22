const DoomManual = () => {
    return (
        <div style={{
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '14px',
            lineHeight: '1.5',
            color: '#000',
            backgroundColor: '#fff',
            padding: '20px',
            whiteSpace: 'pre-wrap'
        }}>
            <h2 style={{ textAlign: 'center', textDecoration: 'underline', marginBottom: '20px' }}>DOOM Read Me</h2>

            <p><strong>DOOM Shareware Version 1.9</strong></p>
            <p>Welcome to DOOM, the game that redefined the first-person shooter genre. You are a space marine, one of Earth's toughest, stationed on Mars. A teleportation experiment has gone horribly wrong, opening a gateway to Hell itself. Now, demons are pouring out, and you're the only one standing in their way.</p>

            <hr style={{ border: '1px dashed #000', margin: '20px 0' }} />

            <h3>CONTROLS</h3>
            <p>Use the keyboard to control the marine:</p>

            <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                <li><strong>ARROWS / WASD</strong> .......... Move & Turn</li>
                <li><strong>CTRL / P</strong> ............... Fire Weapon</li>
                <li><strong>SPACE</strong> .................. Open Doors / Use</li>
                <li><strong>SHIFT</strong> .................. Speed On (Run)</li>
                <li><strong>ALT</strong> .................... Strafe On</li>
                <li><strong>TAB</strong> .................... Automap</li>
                <li><strong>1 - 7</strong> .................. Weapon Selection</li>
                <li><strong>+ / -</strong> .................. Screen Size</li>
                <li><strong>F1 - F12</strong> ............... Game Functions</li>
            </ul>

            <hr style={{ border: '1px dashed #000', margin: '20px 0' }} />

            <h3>STORY</h3>
            <p>You're a marine, one of Earth's toughest, hardened in combat and trained for action. Three years ago, you assaulted a superior officer for ordering his soldiers to fire upon civilians. He and his body cast were shipped to Pearl Harbor, while you were transferred to Mars, home of the Union Aerospace Corporation.</p>
            <p>The UAC is a multi-planetary conglomerate with radioactive waste facilities on Mars and its two moons, Phobos and Deimos. With no action for fifty million miles, your day consisted of sucking dust and watching restricted flicks in the rec room.</p>
            <p>For the last four years the military, UAC's biggest supplier, has used the remote facilities on Phobos and Deimos to perform various secret projects, including research on inter-dimensional space travel. So far they have been able to open gateways between the two moons, throwing a few gadgets into one and watching them come out the other. Recently however, the Gateways have grown dangerously unstable.</p>
            <p>Military "volunteers" entering them have either disappeared or been stricken with a strange form of insanity—babbling vulgarities, bludgeoning anything that breathes, and finally suffering an untimely death of full-body explosion.</p>
            <p>Then things got bad.</p>

            <hr style={{ border: '1px dashed #000', margin: '20px 0' }} />

            <h3>CREDITS</h3>
            <p><strong>id Software (1993)</strong></p>
            <p>Programming: John Carmack, John Romero, Dave Taylor</p>
            <p>Art: Adrian Carmack, Kevin Cloud</p>
            <p>Design: Sandy Petersen, Tom Hall</p>
            <p>Music & Sound: Bobby Prince</p>
            <p>WebAssembly Port: diekmann</p>

        </div>
    );
};

export default DoomManual;
