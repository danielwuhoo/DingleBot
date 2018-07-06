const fs = require("fs");
exports.run = async(client, message, args) => {
	message.channel.bulkDelete(10);
	
};