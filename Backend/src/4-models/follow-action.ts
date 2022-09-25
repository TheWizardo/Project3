class FollowAction {
    public vacationId: number;
    public userId: number;

    public constructor(vId: number, uId: number) {
        this.userId = uId;
        this.vacationId = vId;
    }
}

export default FollowAction;