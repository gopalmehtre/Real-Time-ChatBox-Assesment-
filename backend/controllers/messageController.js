import Message from '../models/message.js';
import Channel from '../models/channel.js';

const getMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    if (!channel.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not a member of this channel' });
    }

    const messages = await Message.find({ channel: channelId })
      .populate('sender', 'username email')
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Message.countDocuments({ channel: channelId });

    res.json({
      messages: messages.reverse(),
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalMessages: total
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const sendMessages = async (req, res) => {
  try {
    const { channel, content } = req.body;

    if (!content || !channel) {
      return res.status(400).json({ message: 'Content and channel are required' });
    }

    const channelDoc = await Channel.findById(channel);
    if (!channelDoc) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    if (!channelDoc.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not a member of this channel' });
    }

    const message = await Message.create({
      sender: req.user._id,
      channel,
      content
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username email');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export {getMessages, sendMessages};