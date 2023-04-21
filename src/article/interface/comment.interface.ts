import { Comment } from '../schemas/comment.schema';
import { userType } from '../../user/type/user.type';

export interface CommentInterface {
  comment: Comment & userType;
}
