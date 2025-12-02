import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required']
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: [true, 'Channel is required']
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

messageSchema.index({ channel: 1, timestamp: -1 });

const messageModel = mongoose.model("Message", messageSchema);

export default messageModel;