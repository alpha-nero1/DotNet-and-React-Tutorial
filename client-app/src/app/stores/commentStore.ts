import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { ChatComment } from "../../types/comment";
import { store } from "./store";

export default class CommentStore {
  comments: ChatComment[] = [];

  hubConnection: HubConnection | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  createHubConnection = (activityId: string) => {
    if (activityId) {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(`http://localhost:5000/chat?activityId=${activityId}`, {
          accessTokenFactory: () => store.userStore.user?.token!
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();
      // Start the actual connection after build.
      this.hubConnection.start();
      // WQe get comments sent on connection.
      // Also, Wow so cool!
      this.hubConnection.on('LoadComments', (comments: ChatComment[]) => {
        runInAction(() => {
          this.comments = comments.map(comm => new ChatComment({
            ...comm,
            createdAt: new Date(`${comm.createdAt}Z`)
          }));
        });
      })
      this.hubConnection.on('ReceiveComment', (comment: ChatComment) => {
        runInAction(() => {
          this.comments.unshift(new ChatComment(comment))
        });
      })
    }
  }

  stopHubConnection = () => {
    if (this.hubConnection) {
      this.hubConnection.stop()
    }
  }

  // Cleanup method!
  clearComments = () => {
    this.comments = [];
    this.stopHubConnection();
  }

  addComment = async (values: any) => {
    values.activityId = store.activityStore.selectedActivity?.id;
    try {
      if (this.hubConnection && values.activityId) {
        await this.hubConnection.invoke('SendComment', values);
      }
    } catch (e) {
      throw e;
    }
  }
}