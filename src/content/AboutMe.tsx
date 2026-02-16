
const AboutMe = () => (
    <div>
        <div className="about-header">
            <p><b>Hi, I'm Leonardo!</b></p>
            <p><i>-iOS Developer</i></p>
        </div>
        <p>I love building apps for the Apple ecosystem. I aim to make them fun and unique.</p>
        <br />
        <fieldset>
            <legend>Skills</legend>
            <div className="field-row skill-row-1">
                <label htmlFor="swift" style={{ fontSize: '22px' }}>Swift</label>
                <label htmlFor="java" style={{ fontSize: '22px' }}>Java</label>
            </div>
            <div className="field-row skill-row-2">
                <label htmlFor="swiftui" style={{ fontSize: '22px' }}>SwiftUI</label>
                <label htmlFor="clang" style={{ fontSize: '22px' }}>C</label>
            </div>
        </fieldset>

        <br />
        <p><b>Computer Science Student</b> at <br /><b>FUMEC - Belo Horizonte</b></p>
    </div>
);

export default AboutMe;
