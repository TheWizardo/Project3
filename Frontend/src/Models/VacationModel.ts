class VacationModel {
    public id: number;
    public dstId: number;
    public dstName: string;
    public dstDescription: string;
    public price: number;
    public startDate: Date;
    public endDate: Date;
    public imageName: string;
    public image: FileList;
    public followersCount: number;
    public isFollowed: boolean;
}

export default VacationModel;
