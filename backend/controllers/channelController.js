import channelModel from "../models/channel.js";
import UserModel from "../models/userModel.js";

const getChannels = async (req, res) => {
    try {
        const channels = await channelModel.find({members: req.user._id})
        .populate('createdBy', 'username email')
        .populate('members', 'username email onlineStatus')
        .sort({createdAt: -1});

        res.json(channels);
    } catch(err) {
        console.error('get channels errors', err);
        res.status(500).json({message : 'server error'});
    }
};


const createChannel = async (req, res) => {
    try {
        const {name} = req.body;

        if(!name) {
            return res.status(400).json({message: 'channel name is required'});
        }
        const existingChannel = await channelModel.findOne({name});
        if(existingChannel) {
            return res.status(400).json({message: 'channel already exists'});
        }

        const channel = await channelModel.create({
            name, 
            createdBy: req.user._id,
            members: [req.user._id]
        });

        const populatedChannel = await channelModel.findById(channel._id).populate('createdBy', 'username email').populate('members', 'username email onlineStatus');

        res.status(201).json(populatedChannel);
    } catch(err) {
        console.error('create channel eror', err);
        res.status(500).json({message: 'server error'});
    }
};


const joinChannel = async(req, res) => {
    try{
        const channel = await channelModel.findById(req.params.id);

        if(!channel) {
            return res.status(400).json({message: 'channel not found'});
        }

        if(channel.members.includes(req.user._id)) {
            return res.status(400).json({message: 'already a member of this channel'});
        }

        channel.members.push(req.user._id);
        await channel.save();

        const populatedChannel = await channelModel.findById(channel._id).populate('createdBy', 'username email').populate('members', 'username email onlinestatus');

        res.json(populatedChannel);
    }catch(err) {
        console.error('join channel error : ', err);
        res.status(500).json({message : 'server error'});
    }
};


const leaveChannel = async (req, res) => {
    try {
        const channel = await channelModel.findById(req.params.id);

        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        const user = await UserModel.findById(req.user._id);

        channel.members = channel.members.filter(
            memberId => memberId.toString() !== req.user._id.toString()
        );
        await channel.save();

        res.json({ message: 'Left channel successfully' });
    } catch (err) {
        console.error('Leave channel error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


const getAllChannels = async (req, res) => {
    try {
        const channels = await channelModel.find()
        .populate('createdBy', 'username email')
        .select('name createdBy members createdAt')
        .sort({createdAt: -1});

        res.json(channels);
    } catch(err) {
        console.error('get all channels error' , err);
        res.status(500).json({message: 'server issue'});
    }
};

export {getChannels ,createChannel , joinChannel, leaveChannel, getAllChannels};