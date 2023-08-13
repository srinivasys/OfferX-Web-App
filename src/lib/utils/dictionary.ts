import { HighestEducationEnum, ManagerPermissionEnum } from '../../types/auth';
import { EmployeeJoinStatusEnum } from '../../types/employee';
import { AutomaticReminderEnum, OfferStateEnum } from '../../types/offer';
import { InviteStatusEnum } from '../../types/invitations';
import { ReviewType } from '../../types/review';

export const getHighestEducation = (value: HighestEducationEnum) => {
    switch (value) {
        case HighestEducationEnum.NohighSchoolDiplomaOrGed:
            return 'No high school diploma or GED';
        case HighestEducationEnum.HighSchoolDiplomaOrGed:
            return 'High school diploma or GED';
        case HighestEducationEnum.Vocational_TradeDegree_MilitaryTraining:
            return 'Vocational / Trade degree / Military training';
        case HighestEducationEnum.SomeCollege_NotEnrolledNow:
            return 'Some college - not enrolled now';
        case HighestEducationEnum.CurrentlyEnrolledInCollege:
            return 'Currently enrolled in college';
        case HighestEducationEnum.BachelorsOrAssociateDegree:
            return 'Bachelors or Associate degree';
        case HighestEducationEnum.GraduateWorkOrGraduateDegree:
            return 'Graduate work or Graduate degree';
        default:
            return 'unknown';
    }
};

export const getPermissionText = (value: ManagerPermissionEnum) => {
    switch (value) {
        case ManagerPermissionEnum.admin:
            return 'Admin';
        case ManagerPermissionEnum.offerManager:
            return 'Offer manager';
        case ManagerPermissionEnum.owner:
            return 'Owner';
        default:
            return 'unknown';
    }
};

export const getJoinStatusText = (value: EmployeeJoinStatusEnum) => {
    switch (value) {
        case EmployeeJoinStatusEnum.pending:
            return 'Pending';
        case EmployeeJoinStatusEnum.joined:
            return 'Joined';
        case EmployeeJoinStatusEnum.deleted:
            return 'Deleted';
        default:
            return 'unknown';
    }
};

export const getInviteStatusText = (value: InviteStatusEnum) => {
    switch (value) {
        case InviteStatusEnum.invited:
            return 'Invited';
        case InviteStatusEnum.joined:
            return 'Joined';
        case InviteStatusEnum.deleted:
            return 'Deleted';
        default:
            return 'unknown';
    }
};

export const getOfferStateText = (value: OfferStateEnum) => {
    switch (value) {
        case OfferStateEnum.pending:
            return 'pending';
        case OfferStateEnum.accepted:
            return 'accepted';
        case OfferStateEnum.rejected:
            return 'declined';
        case OfferStateEnum.retracted:
            return 'retracted';
        case OfferStateEnum.expired:
            return 'expired';
        default:
            return 'unknown';
    }
};

export const getAutomaticReminderText = (value: AutomaticReminderEnum) => {
    switch (value) {
        case AutomaticReminderEnum.never:
            return 'Never';
        case AutomaticReminderEnum.every1Day:
            return 'Every 1 day';
        case AutomaticReminderEnum.every2Day:
            return 'Every 2 days';
        case AutomaticReminderEnum.every3Day:
            return 'Every 3 days';
        case AutomaticReminderEnum.every1Week:
            return 'Every 1 week';
        default:
            return 'unknown';
    }
};

export const getReviewTypeText =(value: ReviewType) => {
    switch(value){
        case ReviewType.OnboardingReview:
        return 'Onboarding review';
        case ReviewType.ProgressReview:
            return 'Performance review';
        case ReviewType.ExitReview:
            return 'Exit review'
    }
};

export const getCandidateReviewTypeText =(value: ReviewType) => {
    switch(value){
        case ReviewType.OnboardingReview:
        return 'Onboarding review';
        case ReviewType.ProgressReview:
            return 'Employment review';
        case ReviewType.ExitReview:
            return 'Exit review'
    }
};