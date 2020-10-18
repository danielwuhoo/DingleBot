module.exports = async (client, oldMessage, newMessage) => {
    if (!client.config.echoDelete) return;

    if (oldMessage.author.bot) return;

    await oldMessage.channel.send(`${oldMessage.content}\n <@${oldMessage.author.id}>`, {files: [...oldMessage.attachments.values()]});
}