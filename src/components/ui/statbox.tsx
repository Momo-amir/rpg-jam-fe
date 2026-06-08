type StatProps = {
    title: string
    shortname: string
    score: number
    modifier: number
}

export const Stats = [
    { id: 1, title: 'Strength', shortname: 'STR', score: 18, modifier: 4},
    { id: 2, title: 'Agility', score: 18, shortname: "AGI", modifier: 4},
    { id: 3, title: 'Constitution', score: 18, shortname: "CON", modifier: 4},
    { id: 4, title: 'Wisdom', score: 18, shortname: "WIS", modifier: 4},
    { id: 5, title: 'Intelligence', score: 18, shortname: "INT", modifier: 4},
    { id: 6, title: 'Charisma', score: 18, shortname: "CHA", modifier: 4}
]

function StatList() {
    return (
        <ul>
            {Stats.map(stat =>
                <li key={stat.id}>
                    {stat.title} is at {stat.score}, which equals to a {stat.modifier} modifier.
                </li>
            )}
        </ul>
    );
}

export default function Statbox({
    title,
    shortname,
    score,
    modifier,
}: StatProps) {
    return (
        <div>
            <div className="flex justify-center flex-col items-center border-border border w-32 p-4">
                <h5>{shortname}</h5>
                <h2>{modifier}</h2>
                <input type='number' min={1} max={20} value={score}></input>
            </div>
        </div>
    );
}