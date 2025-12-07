export default function JobDetail({ params }: { params: { jobId: string } }) {
  return (
    <div>
      JobDetail {params.jobId}
    </div>
  )
}