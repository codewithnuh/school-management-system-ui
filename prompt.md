<Task>I want you to write component for teachers applications where thre would be teachers data with pending application status  I want you to show teachers in table form and pagination there would be a options first status would be pending then admin will change it to rejection or acception on change of status it should show the sooner or toast component. use mock updation functions the reponse of api from teachers which are unregister here is code.

```ts
export const useGetAllAdmins = () => {
  return useQuery({
    queryKey: ["admins"],
    queryFn: () => getAllAdmins(),
  });
};
```

when you will use this like example const {data:adminData}=useGetAllAdmins
you can access data by using adminData.data this will return this object ```json
[
    {
        createdAt: "2025-05-02T13:17:23.000Z"
        email: "codewithnuh@outlook.com"
​​        entityType: "ADMIN"
​​        firstName: "Noor"
​​        id: 1
​        isSubscriptionActive: false
​​        lastName: "ul Hassan"
​​        middleName: null
​​        subscriptionPlan: "monthly"
​​        updatedAt: "2025-05-02T16:36:27.000Z"
    },
    {...}
]

```
some times data is undefined in start it will blank the page I want you to also handle that case ok .
Your job is to create a table where you will show colums there name,email,subscripton status ,subscription plan and and view button to see full details and also add pagination support and add a button to change the subscript status and on tha tbutton implement mock function which logs plan updated and aslo update the status with another function ok 
</Task>
