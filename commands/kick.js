exports.run = async (client, message, args) => {

    let votesNeeded;

    try {
        votesNeeded = message.guild.member(message.mentions.users.first()).voice.channel.members.size / 2;
        if (votesNeeded < 3) votesNeeded = 3;
    } catch (e) {
        message.channel.send(`<@${message.mentions.users.first().id}> is not in a voice channel`);
        return;
    }
    const vote = await message.channel.send(`Need ${votesNeeded} votes to kick <@${message.mentions.users.first().id}>`);

    await vote.react('👍');

    const filter = (reaction, user) => reaction.emoji.name == '👍';

    let collector = vote.createReactionCollector(filter, { time: 20000 });
    collector.on('end', collected => {
        if (collected.get('👍').count >= votesNeeded) {
            message.guild.member(message.mentions.users.first()).voice.setChannel(null);
            vote.edit(`<@${message.mentions.users.first().id}> has been disconnected`);
        } else {
            vote.edit('Vote failed');
        }
    });



};