import classnames from 'classnames'

const Main = ({
  className = '',
  children,
}: {
  className?: string
  children?: React.ReactNode
}) => <main className={classnames('grow', className)}>{children}</main>

export default Main
